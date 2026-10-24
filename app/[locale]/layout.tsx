import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ThemeProvider } from '@/components/theme-provider'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import { routing } from '@/i18n/routing'
import '../globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// 在 build 時預先產生 /en 與 /zh-TW
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      // 頁內錨點平滑捲動；換頁時讓 Next.js 暫時關閉，保持換頁即時
      data-scroll-behavior="smooth"
      className={cn(
        'h-full',
        'motion-safe:scroll-smooth',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
    >
      <body
        // Grammarly、ColorZilla 等瀏覽器擴充功能會在 React 載入前替 <body> 加上屬性；
        // 只略過 body 本身的屬性差異，子元素的 hydration 錯誤仍會照常回報
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground antialiased"
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
