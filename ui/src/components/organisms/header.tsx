import * as React from 'react';
import { clsx } from '../../lib/functions';
import { CustomLink, Link } from '../atoms/link';

export type HeaderProps = {
    logoUrlMobile: string;
    logoUrlDesktop: string;
    logoAltText: string;
    logoHref?: string;
    className?: string;
    customLink?: React.ComponentType<CustomLink>;
    /**
     * the content displayed aside the logo
     */
    leadingElement?: React.ReactNode;
    /**
     * the content displayed at the end of the header
     */
    trailingElement?: React.ReactNode;
};

export function Header({
    className,
    customLink,
    leadingElement,
    trailingElement,
    logoUrlMobile,
    logoUrlDesktop,
    logoAltText,
    logoHref = '#'
}: HeaderProps) {
    return (
        <header
            className={clsx(
                className,
                'lg:shadow-header flex items-center justify-between bg-white p-4'
            )}
        >
            <nav
                className={clsx(
                    'flex items-center gap-2',
                    'md:gap-4',
                    'lg:gap-8'
                )}
            >
                <Link Custom={customLink} href={logoHref}>
                    <img
                        src={logoUrlMobile}
                        alt={logoAltText}
                        className="h-10 w-10 object-contain object-center md:hidden"
                    />
                    <img
                        src={logoUrlDesktop}
                        alt={logoAltText}
                        className="hidden h-10 object-contain object-center md:inline"
                    />
                </Link>
                {leadingElement}
            </nav>

            <div>{trailingElement}</div>
        </header>
    );
}
