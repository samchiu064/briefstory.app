import { useTranslations } from 'next-intl'
import { SiteHeader } from '@/components/SiteHeader'
import { Hero } from '@/components/Hero'
import { StoryGenerator } from '@/components/generator/StoryGenerator'
import { FeaturesSection } from '@/components/FeaturesSection'
import { SiteFooter } from '@/components/SiteFooter'

// Server Component：只有 StoryGenerator 是 client component，其餘區塊在伺服器渲染，不送 JS 到瀏覽器
export default function HomePage() {
  const t = useTranslations('Generator')

  return (
    // isolate 讓背景裝飾的 -z-10 只在 main 內部生效
    <main className="relative isolate overflow-x-clip">
      {/* 背景：品牌色光暈 + 淡格線，往下漸隱 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
      />

      {/* 每個 section 至少佔滿一個螢幕高度 */}
      <section
        id="generator"
        aria-label={t('sectionLabel')}
        className="mx-auto flex min-h-svh max-w-6xl flex-col px-4"
      >
        <SiteHeader />

        {/* nav 以下的剩餘空間：hero + 表單垂直置中，大螢幕上不會在底部留一大片空白 */}
        <div className="flex flex-1 flex-col justify-center pb-12 pt-4">
          <Hero />
          <StoryGenerator />
        </div>
      </section>

      <FeaturesSection />
      <SiteFooter />
    </main>
  )
}
