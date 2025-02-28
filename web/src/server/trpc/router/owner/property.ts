import { TRPCError } from '@trpc/server';
import {
    updatePropertyStep1Schema,
    updatePropertyStep2Schema,
    updatePropertyStep4Schema,
    updatePropertyStep5Schema,
    updatePropertyStep6Schema,
    updatePropertyStep7Schema,
    updatePropertyStep8Schema
} from '~/lib/validation-schemas/property-schema';
import { z } from 'zod';
import { t } from '~/server/trpc/root';
import { isOwner } from '~/server/trpc/middleware/auth';
import { isCustomAmenity } from './draft';
import { Uuid } from '~/lib/uuid';

import { type Amenity, RoomType, Room } from '@prisma/client';
import { Cache, CacheKeys } from '~/server/cache';

const protectedProcedure = t.procedure.use(isOwner);
export const ownerPropertiesRouter = t.router({
    getSingle: protectedProcedure
        .input(
            z.object({
                uid: z.string().uuid()
            })
        )
        .query(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    userId: ctx.user.id,
                    id: input.uid,
                    archived: false
                },
                include: {
                    rooms: true,
                    municipality: true,
                    amenities: true
                }
            });

            return property;
        }),
    getBookings: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).nullish(),
                cursor: z.string().nullish(),
                initialCursor: z.string().nullish()
            })
        )
        .query(async ({ ctx, input }) => {
            const limit = input.limit ?? 8;
            const cursor = input.cursor ?? input.initialCursor;

            const bookings = await ctx.prisma.propertyBooking.findMany({
                where: {
                    property: {
                        archived: false,
                        userId: ctx.user.id
                    }
                },
                include: {
                    applicant: true,
                    property: true
                },
                take: limit + 1,
                cursor: cursor
                    ? {
                          id: cursor
                      }
                    : undefined,
                orderBy: {
                    dateOfReservation: 'desc'
                }
            });

            let nextCursor: string | undefined = undefined;

            if (bookings.length > limit) {
                // Remove the last item and use it as next cursor
                const lasProperty = bookings.pop()!;
                nextCursor = lasProperty.id;
            }

            return {
                bookings,
                nextCursor
            };
        }),
    toggleVisibility: protectedProcedure
        .input(
            z.object({
                uid: z.string().uuid()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                include: {
                    amenities: true,
                    city: true,
                    municipality: true,
                    rooms: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de modifier n'existe pas."
                });
            }

            const newVisibility = !property.activeForListing;

            await ctx.prisma.property.updateMany({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                data: {
                    activeForListing: newVisibility
                }
            });

            if (!newVisibility) {
                ctx.typesense.remove(input.uid);
            } else {
                ctx.typesense.index(property);
            }

            // invalidate cache for property
            await Cache.invalidate(CacheKeys.properties.single(input.uid));
            await Cache.invalidate(CacheKeys.municipalities.all());

            return {
                isActive: !property.activeForListing
            };
        }),
    deleteProperty: protectedProcedure
        .input(
            z.object({
                uid: z.string().uuid()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de supprimer n'existe pas."
                });
            }

            await ctx.prisma.property.updateMany({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                data: {
                    archived: true
                }
            });

            // remove property from search index
            ctx.typesense.remove(input.uid);

            // invalidate cache for property
            await Cache.invalidate(CacheKeys.properties.single(input.uid));
            await Cache.invalidate(CacheKeys.municipalities.all());
        }),
    duplicate: protectedProcedure
        .input(
            z.object({
                uid: z.string().uuid()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    userId: ctx.user.id,
                    id: input.uid,
                    archived: false
                },
                include: {
                    amenities: true,
                    rooms: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de dupliquer n'existe pas"
                });
            }

            /**
             * Create Property based on the previous one
             **/
            // base object for creating a property
            const propertyCreated = {
                archived: false,
                noOfRooms: property.noOfRooms,
                userId: ctx.user.id,
                surfaceArea: property.surfaceArea,
                rentType: property.rentType,
                addressInstructions: property.addressInstructions,
                latitude: property.latitude,
                longitude: property.longitude,
                geoData: property.geoData,
                locality_osm_id: property.locality_osm_id,
                localityName: property.localityName,
                cityId: property.cityId,
                municipalityId: property.municipalityId,
                images: property.images,
                locality_bbox: property.locality_bbox,
                agencyMonthsPaymentAdvance: property.agencyMonthsPaymentAdvance,
                cautionMonthsPaymentAdvance:
                    property.cautionMonthsPaymentAdvance,
                availableFrom: property.availableFrom,
                description: property.description,
                housingFee: property.housingFee,
                housingPeriod:
                    property.rentType === 'SHORT_TERM'
                        ? property.housingPeriod
                        : 30
            };

            /**
             * ADD Amenities to the property
             * This is only possible if the property is a short term property
             */
            const amenities =
                property.rentType === 'SHORT_TERM' ? property.amenities : [];

            /**
             * Create the property in the DB
             */
            const { id: newPropertyId } = await ctx.prisma.property.create({
                data: {
                    ...propertyCreated,
                    images: propertyCreated.images as any[],
                    geoData: propertyCreated.geoData as any[],
                    locality_bbox: propertyCreated.locality_bbox as any[],
                    activeForListing: true,
                    rooms: {
                        createMany: {
                            data: property.rooms.map(room => ({
                                type: room.type
                            }))
                        }
                    },
                    amenities: {
                        createMany: {
                            data: amenities.map(am => ({
                                name: am.name,
                                type: am.type
                            }))
                        }
                    }
                }
            });

            // Index the new property
            const newProperty = await ctx.prisma.property.findUnique({
                where: {
                    id: newPropertyId
                },
                include: {
                    amenities: true,
                    rooms: true,
                    municipality: true,
                    city: true
                }
            });
            await ctx.typesense.index(newProperty!);

            return { success: true };
        }),
    savePropertyStep1: protectedProcedure
        .input(updatePropertyStep1Schema)
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                include: {
                    amenities: true,
                    rooms: true,
                    municipality: true,
                    city: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de modifier n'existe pas"
                });
            }

            await ctx.prisma.property.update({
                where: {
                    id: input.uid
                },
                data: {
                    surfaceArea: input.surfaceArea,
                    rentType: input.rentType
                }
            });

            // reindex the property
            await ctx.typesense.reindex(property);

            // invalidate cache for property
            await Cache.invalidate(CacheKeys.properties.single(input.uid));
            await Cache.invalidate(CacheKeys.municipalities.all());
        }),
    savePropertyStep2: protectedProcedure
        .input(updatePropertyStep2Schema)
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                include: {
                    amenities: true,
                    rooms: true,
                    municipality: true,
                    city: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de modifier n'existe pas"
                });
            }

            const municipality = await ctx.prisma.municipality.findUnique({
                where: {
                    id: input.municipalityUid
                },
                include: {
                    city: true
                }
            });

            if (!municipality) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: "La commune que vous avez indiqué n'existe pas."
                });
            }

            await ctx.prisma.property.update({
                where: {
                    id: input.uid
                },
                data: {
                    locality_osm_id: input.localityOSMID,
                    locality_bbox: input.boundingBox,
                    cityId: input.cityUid,
                    municipalityId: input.municipalityUid,
                    longitude: input.longitude,
                    latitude: input.latitude,
                    geoData: input.geoJSON,
                    localityName: input.localityName
                }
            });

            // reindex the property
            await ctx.typesense.reindex(property);

            // invalidate cache for property
            await Cache.invalidate(CacheKeys.properties.single(input.uid));
            await Cache.invalidate(CacheKeys.municipalities.all());
        }),
    savePropertyStep4: protectedProcedure
        .input(updatePropertyStep4Schema)
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                include: {
                    amenities: true,
                    rooms: true,
                    municipality: true,
                    city: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de modifier n'existe pas"
                });
            }

            await ctx.prisma.property.update({
                where: {
                    id: input.uid
                },
                data: {
                    addressInstructions: input.addressInstructions
                }
            });

            // reindex the property
            await ctx.typesense.reindex(property);

            // invalidate cache for property
            await Cache.invalidate(CacheKeys.properties.single(input.uid));
            await Cache.invalidate(CacheKeys.municipalities.all());
        }),
    savePropertyStep5: protectedProcedure
        .input(updatePropertyStep5Schema)
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                include: {
                    amenities: true,
                    rooms: true,
                    municipality: true,
                    city: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de modifier n'existe pas"
                });
            }

            /**
             * Count the number of Rooms to the property
             */
            type DraftPropertyRoom = Pick<Room, 'type'>;
            let noOfRooms = 0;
            for (const room of input.additionalRooms as Array<DraftPropertyRoom>) {
                // the rooms that are counted in the display of the total number of rooms
                const roomCountedInDisplayOfTotal = [
                    RoomType.BEDROOM,
                    RoomType.LIVING_ROOM,
                    RoomType.KITCHEN
                ] as Array<RoomType>;

                if (roomCountedInDisplayOfTotal.includes(room.type)) {
                    noOfRooms += 1;
                }
            }

            const updatedProperty = await ctx.prisma.property.update({
                where: {
                    id: input.uid
                },
                data: {
                    noOfRooms,
                    rooms: {
                        deleteMany: {},
                        createMany: {
                            data: input.additionalRooms
                        }
                    }
                }
            });

            // reindex the property
            await ctx.typesense.reindex(property);

            // invalidate cache for property
            await Cache.invalidate(CacheKeys.properties.single(input.uid));
            await Cache.invalidate(CacheKeys.municipalities.all());

            return {
                rentType: updatedProperty.rentType
            };
        }),
    savePropertyStep6: protectedProcedure
        .input(updatePropertyStep6Schema)
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                include: {
                    amenities: true,
                    rooms: true,
                    municipality: true,
                    city: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de modifier n'existe pas"
                });
            }

            const amenities: Array<Pick<Amenity, 'name' | 'type'>> = [];

            if (property.rentType === 'SHORT_TERM') {
                for (const amenity of input.amenities) {
                    if (isCustomAmenity(amenity)) {
                        amenities.push({
                            name: amenity.name,
                            type: 'OTHER'
                        });
                    } else {
                        amenities.push({
                            name: null,
                            type: amenity.type
                        });
                    }
                }
            }

            await ctx.prisma.property.update({
                where: {
                    id: input.uid
                },
                data: {
                    amenities: {
                        deleteMany: {},
                        createMany: {
                            data: amenities
                        }
                    }
                }
            });

            // reindex the property
            await ctx.typesense.reindex(property);
            // invalidate cache for property
            await Cache.invalidate(CacheKeys.properties.single(input.uid));
            await Cache.invalidate(CacheKeys.municipalities.all());
        }),
    savePropertyStep7: protectedProcedure
        .input(updatePropertyStep7Schema)
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                include: {
                    amenities: true,
                    rooms: true,
                    municipality: true,
                    city: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "L'annonce que vous essayez de modifier n'existe pas"
                });
            }

            await ctx.prisma.property.update({
                where: {
                    id: input.uid
                },
                data: {
                    images: input.images
                }
            });

            // reindex the property
            await ctx.typesense.reindex(property);

            // invalidate cache for property
            await Cache.invalidate(CacheKeys.properties.single(input.uid));
            await Cache.invalidate(CacheKeys.municipalities.all());
        }),
    savePropertyStep8: protectedProcedure
        .input(updatePropertyStep8Schema)
        .mutation(async ({ ctx, input }) => {
            const property = await ctx.prisma.property.findFirst({
                where: {
                    id: input.uid,
                    userId: ctx.user.id,
                    archived: false
                },
                include: {
                    amenities: true,
                    rooms: true,
                    municipality: true,
                    city: true
                }
            });

            if (!property) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message:
                        "Le logement que vous essayez de modifier n'existe pas"
                });
            }

            // Update the old listing
            await ctx.prisma.property.update({
                where: {
                    id: property.id
                },
                data: {
                    agencyMonthsPaymentAdvance:
                        input.agencyMonthsPaymentAdvance,
                    cautionMonthsPaymentAdvance:
                        input.cautionMonthsPaymentAdvance,
                    availableFrom: input.availableFrom,
                    description: input.description,
                    housingFee: input.housingFee,
                    housingPeriod:
                        property.rentType === 'SHORT_TERM'
                            ? input.housingPeriod
                            : 30
                }
            });

            // reindex the property
            await ctx.typesense.reindex(property);

            // invalidate cache for property
            await Cache.invalidate(CacheKeys.properties.single(input.uid));
            await Cache.invalidate(CacheKeys.municipalities.all());

            return {
                propertyShortUid: new Uuid(property.id).short()
            };
        })
});
