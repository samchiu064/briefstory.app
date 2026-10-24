import { Anchor, HelpCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeleprompterModal } from '@/components/TeleprompterModal'
import type { Story } from '@/db/schema'
import { categoryKey } from '@/lib/categories'
import { STAR_STEPS } from '@/lib/star'

interface Props {
  story: Story
}

export function StoryResult({ story }: Props) {
  const t = useTranslations()

  return (
    <Card className="shadow-lg ring-primary/20">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline">
            {t(`Categories.${categoryKey(story.category)}`)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {t('Generator.languageValue', {
              language: t(`Languages.${story.outputLanguage}`),
            })}
          </span>
        </div>
        <CardTitle className="text-xl font-semibold">{story.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 記憶關鍵字 (Memory Anchors) */}
        <div className="rounded-lg bg-muted/50 p-3">
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Anchor className="size-3.5" />
            {t('Generator.memoryAnchors')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {story.memoryAnchors.map((anchor, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="h-auto bg-background px-3 py-1 text-sm font-medium"
              >
                {anchor}
              </Badge>
            ))}
          </div>
        </div>

        <TeleprompterModal story={story} />

        {/* STAR 段落：左側字母標記 + 連接線 */}
        <ol className="space-y-5">
          {STAR_STEPS.map((step, i) => (
            <li key={step.letter} className="relative flex gap-4">
              {i < STAR_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-3.5 top-9 -bottom-5 w-px bg-border"
                />
              )}
              <span
                aria-hidden
                className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${step.color}`}
              >
                {step.letter}
              </span>
              <div className="min-w-0 pt-0.5">
                <h3 className="mb-1 text-sm font-semibold">
                  {t(`Star.${step.key}`)}
                </h3>
                {step.key === 'action' ? (
                  <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                    {story.action.map((act, j) => (
                      <li key={j}>{act}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {story[step.key]}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* AI Follow-up Questions (若有) */}
        {story.followUpQuestions && story.followUpQuestions.length > 0 && (
          <div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            <div className="flex items-center gap-1 font-medium">
              <HelpCircle className="size-3.5" />
              {t('Generator.tips')}
            </div>
            <ul className="list-inside list-disc space-y-0.5 pl-1">
              {story.followUpQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
