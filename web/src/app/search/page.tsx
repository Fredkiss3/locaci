import * as React from 'react';
/**
 * We import leaflet css in a layout because when you import a css in a file
 * nextjs try to hoist it on the <head/> tag, with suspense and SSR it can cause problems
 * if imported at a random component in the tree.
 */
import 'leaflet/dist/leaflet.css';

// components
import { FiltersMobile } from '~/features/search/components/filters-mobile';
import { MapToggleButton } from '~/features/search/components/map-toggle-button';
import { SearchListResult } from '~/features/search/components/search-list-result';
import { HydrateClient } from '~/server/trpc/rsc/HydrateClient';
import { SearchMap } from '~/features/search/components/search-map';

// utils
import { clsx } from '@locaci/ui/lib/functions';
import { use } from 'react';
import { getAllMunicipalities } from '~/server/trpc/rsc/cached-queries';
import { rsc } from '~/server/trpc/rsc';
import { headers } from 'next/headers';
import {
    getMetadata,
    getTitleForSearchParams,
    parseSearchParams
} from '~/lib/functions';

// this is a dynamic page,
// FIXME: see https://github.com/vercel/next.js/issues/44744
export const dynamic = 'force-dynamic';

// types
import type { MetadataParams, PageProps } from '~/next-app-types';
import type { Metadata } from 'next';

export function generateMetadata({ searchParams }: MetadataParams): Metadata {
    const searchParsed = parseSearchParams(searchParams!);
    const title = getTitleForSearchParams(searchParsed);
    return getMetadata({
        title,
        path: `/search`
    });
}

export default function SearchPage({ searchParams }: PageProps) {
    const searchParsed = parseSearchParams(searchParams!);
    const isTextHTMLRequest =
        headers().get('Accept')?.includes('text/html') ?? false;

    // Only make request for the first SSR requests
    if (isTextHTMLRequest) {
        // Omit view from query input
        const { view, ...queryInput } = searchParsed;
        use(rsc.property.search.fetch(queryInput));
    }

    const municipalitiesPromise = getAllMunicipalities().then(result =>
        result.map(m => ({ label: m.name, value: m.id }))
    );

    return (
        <div className="grid gap-4 lg:grid-cols-5 xl:grid-cols-8">
            <HydrateClient state={use(rsc.dehydrate())}>
                <SearchListResult
                    defaultMunicipalities={use(municipalitiesPromise)}
                />
                <SearchMap />
            </HydrateClient>

            <MapFilterSection />
        </div>
    );
}

function MapFilterSection() {
    const municipalitiesPromise = getAllMunicipalities().then(result =>
        result.map(m => ({ label: m.name, value: m.id }))
    );

    return (
        <div
            className={clsx(
                'fixed bottom-0 left-0 right-0 z-20 gap-4 bg-white',
                'flex items-center justify-between',
                'px-4 py-8',
                'border-t border-gray/50',
                'md:px-8 lg:hidden'
            )}>
            <MapToggleButton />
            <FiltersMobile defaultMunicipalities={use(municipalitiesPromise)} />
        </div>
    );
}
