// components
import { Header } from '@locaci/ui/components/organisms/header';
import { NextLink } from '~/features/shared/components/next-link';
import { HeaderBreadCrumb } from '~/features/owner/components/header-breadcrumb';

// utils
import { getUserFromSessionToken } from '~/server/ssr-helpers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// types
import type { LayoutProps } from '~/types';
import { UserDropdown } from '~/features/owner/components/user-dropdown';

export default async function OwnerLayout(props: LayoutProps) {
    const session = cookies().get('__session')?.value;
    const user = session ? await getUserFromSessionToken(session) : null;

    if (user?.role !== 'PROPERTY_OWNER') {
        redirect(`/auth/login`);
    }

    return (
        <>
            <Header
                logoHref={`/`}
                customLink={NextLink}
                logoAltText="Logo LOCACI"
                logoUrlDesktop="/logo.svg"
                logoUrlMobile="/favicon.svg"
                leadingElement={
                    <>
                        <HeaderBreadCrumb />
                    </>
                }
                trailingElement={
                    <UserDropdown
                        user={{
                            firstName: user.firstName,
                            lastName: user.lastName,
                            avatarURL: user.avatarURL
                        }}
                    />
                }
            />
            <main>{props.children}</main>
        </>
    );
}
