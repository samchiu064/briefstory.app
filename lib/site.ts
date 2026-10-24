import { routing } from '@/i18n/routing'

// 正式網域；部署到其他網域（或 preview 環境）時用 NEXT_PUBLIC_SITE_URL 覆寫
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://briefstory.app'

export const SITE_NAME = 'BriefStory'

// 版權年份：作品首次發布的年份（固定值，不隨時間變動）
export const COPYRIGHT_YEAR = 2026

// 作者：顯示在頁尾，並寫進 metadata 與結構化資料
export const AUTHOR = { name: 'Sam Chiu', url: 'https://samchiu.dev' } as const

// Open Graph 使用底線格式的 locale（例如 zh_TW）
export const OG_LOCALES = { en: 'en_US', 'zh-TW': 'zh_TW' } as const

// hreflang：每個語系各一個網址，x-default 給不支援語言的使用者（/ 會依瀏覽器語言轉址）
export function languageAlternates(base = '') {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}`])),
    'x-default': `${base}/`,
  }
}
