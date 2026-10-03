import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    experimental: {
        /* options here */
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: false,
            },
        ];
    },
};

export default withNextIntl(nextConfig);
