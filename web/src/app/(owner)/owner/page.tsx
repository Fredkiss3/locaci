import * as React from 'react';

// components
import { LoadingIndicator } from '@locaci/ui/components/atoms/loading-indicator';
import { DashboardTabs } from '~/features/owner/components/dashboard-tabs';
import { PropertyList } from '~/features/owner/components/property-list';
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';
import { BookingList } from '~/features/owner/components/booking-list';

// utils
import { rsc } from '~/server/trpc/rsc';
import { use } from 'react';
import { getMetadata } from '~/lib/functions';

// types
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
    return getMetadata({
        title: 'Tableau de bord',
        path: '/owner',
        noIndex: true
    });
}

export default function OwnerDashboardPage() {
    return (
        <section className="px-4 pt-10">
            <DashboardTabs
                properties={
                    <React.Suspense
                        fallback={
                            <section className="mx-auto flex w-full items-center justify-center py-64 px-4">
                                <h1 className="flex items-center gap-4 text-2xl">
                                    <LoadingIndicator className="h-10" />
                                    <span>Chargement de vos propriétés...</span>
                                </h1>
                            </section>
                        }>
                        <SuspenseDraftList />
                    </React.Suspense>
                }
                bookings={
                    <React.Suspense
                        fallback={
                            <section className="mx-auto flex w-full items-center justify-center py-64 px-4">
                                <h1 className="flex items-center gap-4 text-2xl">
                                    <LoadingIndicator className="h-10" />
                                    <span>Chargement des réservations...</span>
                                </h1>
                            </section>
                        }>
                        <SuspenseBookingList />
                    </React.Suspense>
                }
            />
        </section>
    );
}

function SuspenseDraftList() {
    use(rsc.owner.draft.getAll.fetch());

    return (
        <HydrateClient state={use(rsc.dehydrate())}>
            <PropertyList />
        </HydrateClient>
    );
}

function SuspenseBookingList() {
    use(rsc.owner.property.getBookings.fetchInfinite({ limit: 8 }));

    return (
        <HydrateClient state={use(rsc.dehydrate())}>
            <BookingList />
        </HydrateClient>
    );
}
