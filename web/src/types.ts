type PageParams = Record<string, string>;
export type PageProps = {
    params: PageParams;
    searchParams?: any;
};

export type LayoutProps = {
    children: React.ReactNode;
    params: PageParams;
};

export type HeadProps = {
    params: PageParams;
};

export type ErrorBoundaryProps = {
    error: Error;
    reset: () => void;
};

export type ListingImage = {
    uri: string;
    name: string;
};
