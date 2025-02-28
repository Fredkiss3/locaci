'use client';
import * as React from 'react';

// components
import { Button } from '@locaci/ui/components/atoms/button';
import { PropertyCard } from '@locaci/ui/components/molecules/property-card';
import { RefreshIcon } from '@locaci/ui/components/atoms/icons/refresh';
import { NextLink } from '~/features/shared/components/next-link';
import { ArrowRightIcon } from '@locaci/ui/components/atoms/icons/arrow-right';
import Image from 'next/image';

// utils
import { t } from '~/app/trpc-client-provider';
import { getPropertyTitle } from '~/lib/functions';

// types
import type { ListingImage } from '~/features/shared/types';

export function PropertyHomeList() {
    const { data, hasNextPage, isFetching, fetchNextPage } =
        t.property.getRecentProperties.useInfiniteQuery(
            {
                limit: 6
            },
            {
                getNextPageParam(lastPage) {
                    return lastPage.nextCursor;
                },
                refetchOnMount: false,
                staleTime: Infinity
            }
        );

    return (
        <div className="flex w-full flex-col items-center gap-8">
            <ul className="grid w-full auto-rows-max place-items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3 xl:gap-14">
                {data?.pages?.map((page, index) => (
                    <React.Fragment key={index}>
                        {page.properties.map(p => (
                            <li key={p.id} className={`w-full`}>
                                <PropertyCard
                                    className="h-full w-full"
                                    // with querystring
                                    href={`/properties/${p.id}`}
                                    title={getPropertyTitle(p)}
                                    address={p.localityName}
                                    // @ts-ignore
                                    customImage={Image}
                                    customLink={NextLink}
                                    numberOfRooms={p.noOfRooms}
                                    surfaceArea={p.surfaceArea}
                                    price={p.housingFee}
                                    housingPeriod={p.housingPeriod}
                                    coverURL={
                                        p.images
                                            ? (
                                                  p.images as Array<ListingImage>
                                              )[0]?.uri
                                            : ''
                                    }
                                />
                            </li>
                        ))}
                    </React.Fragment>
                ))}
            </ul>

            {hasNextPage && (
                <Button
                    variant="primary"
                    loading={isFetching}
                    onClick={() => fetchNextPage()}
                    renderLeadingIcon={cls => <RefreshIcon className={cls} />}>
                    En charger plus
                </Button>
            )}
            <NextLink
                dynamic
                href="/search"
                className="flex items-center gap-2 text-lg font-semibold text-primary underline">
                <span>Voir tous les logements</span>
                <ArrowRightIcon className="h-4 w-4" weight="bold" />
            </NextLink>
        </div>
    );
}
