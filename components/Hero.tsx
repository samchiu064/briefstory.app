import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'

export function Hero() {
  const t = useTranslations('Hero')

  return (
    <header className="mx-auto max-w-5xl pb-8 text-center">
      <Badge
        variant="outline"
        className="h-auto gap-1.5 rounded-full bg-background/60 px-3 py-1 text-muted-foreground backdrop-blur"
      >
        <Sparkles className="text-primary" />
        {t('badge')}
      </Badge>
      <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {t.rich('title', {
          highlight: (chunks) => (
            <span className="bg-linear-to-r from-indigo-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
              {chunks}
            </span>
          ),
        })}
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground sm:text-lg">
        {t('subtitle')}
      </p>
    </header>
  )
}
