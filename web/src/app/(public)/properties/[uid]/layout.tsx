// utils
import { capitalize, getMetadata, getPropertyTitle } from '~/lib/functions';
import { getPropertyDetail } from '~/server/trpc/rsc/cached-queries';
import { formatNumberToFCFA } from '@locaci/ui/lib/functions';

// types
import type { LayoutProps, MetadataParams } from '~/next-app-types';
import type { ListingImage } from '~/features/shared/types';
import type { Metadata } from 'next';

export async function generateMetadata({
    params
}: MetadataParams<{ uid: string }>): Promise<Metadata> {
    const property = await getPropertyDetail(params.uid);

    let title = 'Erreur 404';

    if (property) {
        const type = getPropertyTitle({
            noOfRooms: property.noOfRooms,
            rentType: property.rentType
        });

        const surface = `${property.surfaceArea} m²`;
        const rooms = `${property.noOfRooms} pièce${
            property.noOfRooms > 1 ? 's' : ''
        }`;

        const price = `${formatNumberToFCFA(property.housingFee)}/${
            property.housingPeriod === 30
                ? 'mois'
                : property.housingPeriod === 7
                ? 'semaine'
                : 'jour'
        }`;

        const commune = capitalize(property.municipality.name);

        title = `${type} à ${commune} - ${surface} - ${rooms} - ${price}`;
    }

    return getMetadata({
        title,
        description: property?.description,
        type: `article`,
        articlePublishedAt: property?.createdAt,
        imageURL: (property?.images as Array<ListingImage>)?.[0]?.uri
    });
}

export default function PropertyDetailLayout({ children }: LayoutProps) {
    return <>{children}</>;
}
