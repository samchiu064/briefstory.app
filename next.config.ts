import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// 預設讀取 ./i18n/request.ts
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default withNextIntl(nextConfig)
