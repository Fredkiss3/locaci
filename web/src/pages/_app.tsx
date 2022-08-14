// src/pages/_app.tsx
import { withTRPC } from '@trpc/next';
import type { AppRouter } from '../server/router';
import type { AppProps } from 'next/app';
import superjson from 'superjson';
import '../styles/globals.css';
import { ReactQueryDevtools } from 'react-query/devtools';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <ReactQueryDevtools />
        </>
    );
}

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return '';
    }
    if (process.browser) return ''; // Browser should use current path
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
    config({ ctx }) {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        const url = `${getBaseUrl()}/api/trpc`;

        return {
            url,
            transformer: superjson,
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            queryClientConfig: {
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        staleTime: 300_000
                    }
                }
            },
            headers: () => {
                // on ssr, forward client's headers to the server
                return {
                    cookie: ctx?.req?.headers.cookie
                };
            }
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: false
})(MyApp);
