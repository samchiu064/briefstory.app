import Image from 'next/image'
import { ArrowUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// 文案在 messages/*.json 的 Features.<key>
const FEATURES = [
  { key: 'generate', image: '/features/generate.svg' },
  { key: 'refine', image: '/features/refine.svg' },
  { key: 'teleprompter', image: '/features/teleprompter.svg' },
] as const

export function FeaturesSection() {
  const t = useTranslations('Features')

  return (
    <section
      aria-labelledby="features-title"
      className="flex min-h-svh flex-col justify-center border-t bg-muted/30 py-20"
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {t('eyebrow')}
          </p>
          <h2
            id="features-title"
            className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t('title')}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Card
              key={feature.key}
              className="group shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-primary/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* 圖片必須是 Card 的第一個子元素，Card 才會移除上方 padding 並套用圓角 */}
              <Image
                src={feature.image}
                alt=""
                width={640}
                height={360}
                className="aspect-video w-full bg-linear-to-br from-primary/15 via-muted to-muted object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <CardHeader className="pb-2">
                <span className="text-xs font-semibold tabular-nums text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <CardTitle className="text-lg font-semibold">
                  <h3>{t(`${feature.key}.title`)}</h3>
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {t(`${feature.key}.description`)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#generator"
            className={buttonVariants({ size: 'lg', className: 'px-5' })}
          >
            <ArrowUp />
            {t('cta')}
          </a>
        </div>
      </div>
    </section>
  )
}
