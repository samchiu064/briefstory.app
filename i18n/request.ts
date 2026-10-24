import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { locale as rootLocale } from 'next/root-params'
import { routing } from './routing'

export default getRequestConfig(async ({ locale }) => {
  // locale 只有在明確指定時才會有值，例如 getTranslations({ locale: 'en' })；
  // 否則從網址的 [locale] 片段讀取（next/root-params）
  const requested = locale ?? (await rootLocale())

  // [locale] 片段會接住任何路徑，不合法時退回預設語系
  const resolved = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale: resolved,
    messages: (await import(`../messages/${resolved}.json`)).default,
  }
})
