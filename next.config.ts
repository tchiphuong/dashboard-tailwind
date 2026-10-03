import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.NEXT_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isGithubPages ? '/dashboard-tailwind' : '');

const nextConfig: NextConfig = {
    ...(isGithubPages ? { output: 'export' as const } : {}),
    ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    experimental: {
        /* options here */
    },
    ...(!isGithubPages
        ? {
              async redirects() {
                  return [
                      {
                          source: '/',
                          destination: '/dashboard',
                          permanent: false,
                      },
                  ];
              },
          }
        : {}),
};

export default withNextIntl(nextConfig);
