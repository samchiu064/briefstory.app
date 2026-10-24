import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { languageAlternates, SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  // 每個語系一筆，並附上彼此的 hreflang 對應
  return routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: { languages: languageAlternates(SITE_URL) },
  }))
}
