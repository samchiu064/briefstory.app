import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { STAR_STEPS } from '@/lib/star'

interface Props {
  loading: boolean
}

// 空狀態：預覽 STAR 結構，生成中時閃爍
export function StoryPlaceholder({ loading }: Props) {
  const t = useTranslations('Generator')

  return (
    <Card className="border border-dashed bg-card/60 ring-0 backdrop-blur">
      <CardContent className="flex min-h-80 flex-1 flex-col justify-center gap-6 py-6">
        <div className="space-y-4" aria-hidden>
          {STAR_STEPS.map((step) => (
            <div
              key={step.letter}
              className={`flex items-center gap-4 ${loading ? 'animate-pulse' : 'opacity-60'}`}
            >
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${step.color}`}
              >
                {step.letter}
              </span>
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-1/3 rounded-full bg-muted-foreground/20" />
                <div className="h-2 w-5/6 rounded-full bg-muted-foreground/10" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {loading ? t('emptyStateLoading') : t('emptyState')}
        </p>
      </CardContent>
    </Card>
  )
}
