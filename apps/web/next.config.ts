import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@cefr/core', '@cefr/ui'],
  // OG/Twitter images read these fonts from disk at render time.
  outputFileTracingIncludes: { '/*': ['../../packages/ui/assets/fonts/**'] },
  experimental: {
    optimizePackageImports: ['lucide-react', 'radix-ui'],
  },
};

export default withNextIntl(nextConfig);
