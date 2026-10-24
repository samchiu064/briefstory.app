import { routing } from '@/i18n/routing'
import messages from './messages/en.json'

// 讓 next-intl 的 locale 與翻譯 key 有型別檢查（以 en.json 為準）
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
