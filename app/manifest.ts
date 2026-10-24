import type { MetadataRoute } from 'next'
import { SITE_NAME } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description:
      'Turn resume bullets into interview-ready STAR stories, then refine and rehearse them.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    // 與 globals.css 的 --primary（indigo）一致
    theme_color: '#4f39f6',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
  }
}
