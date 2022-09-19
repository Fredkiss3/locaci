import { z } from 'zod';
import { RentType } from '../../entities/Property';

export const UpdatePropertyInformationsRequestSchema = z.object({
    propertyId: z.string().uuid(),
    userId: z.string().uuid(),
    longitude: z.number(),
    latitude: z.number(),
    surfaceArea: z.number().min(9),
    commune: z.string().min(1),
    district: z.string().min(1),
    city: z.string().min(1),
    address: z.string().nullable(),
    boundingBox: z.object({
        minLongitude: z.number(),
        minLatitude: z.number(),
        maxLongitude: z.number(),
        maxLatitude: z.number()
    })
});

export type UpdatePropertyInformationsRequest = z.infer<
    typeof UpdatePropertyInformationsRequestSchema
>;
