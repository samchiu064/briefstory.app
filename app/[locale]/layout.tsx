import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ThemeProvider } from '@/components/theme-provider'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import { routing } from '@/i18n/routing'
import '../globals.css'
import { cn } from '@/lib/utils'
import { languageAlternates, OG_LOCALES, SITE_NAME, SITE_URL } from '@/lib/site'

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
  const title = t('title')
  const description = t('description')
  const ogImage = {
    url: `/og/${locale}.png`,
    width: 1200,
    height: 630,
    alt: title,
  }

  return {
    // 讓下面的相對網址（canonical、hreflang、OG 圖片）都變成完整網址
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: SITE_NAME,
    alternates: {
      canonical: `/${locale}`,
      // 告訴搜尋引擎同一頁的其他語言版本
      languages: languageAlternates(),
    },
    // 分享到 LinkedIn、Slack、LINE、Facebook 時的預覽卡片
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: `/${locale}`,
      title,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALES[l]),
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const t = await getTranslations({ locale, namespace: 'Metadata' })
  // 結構化資料：告訴搜尋引擎這是一個 Web 應用程式
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    description: t('description'),
    inLanguage: locale,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
  }

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
        <script
          type="application/ld+json"
          // 把 < 轉成 unicode，避免內容被當成 HTML 標籤（XSS）
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
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
