import type { ReactNode } from 'react'
import { FileText, Loader2, Wand2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { Story } from '@/db/schema'
import { CATEGORIES } from '@/lib/categories'
import { LIMITS } from '@/lib/limits'

export type OutputLanguage = Story['outputLanguage']

const LANGUAGES = ['en', 'zh-TW'] as const satisfies readonly OutputLanguage[]

// 選中的 pill 用 primary 色凸顯
const pillClassName =
  'rounded-full aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90'

interface Props {
  category: string
  onCategoryChange: (category: string) => void
  outputLanguage: OutputLanguage
  onOutputLanguageChange: (language: OutputLanguage) => void
  resumeContent: string
  onResumeContentChange: (content: string) => void
  error: string | null
  loading: boolean
  onSubmit: (e: React.SubmitEvent) => void
  // 表單下方的額外內容（精煉區塊）
  children?: ReactNode
}

export function StoryForm({
  category,
  onCategoryChange,
  outputLanguage,
  onOutputLanguageChange,
  resumeContent,
  onResumeContentChange,
  error,
  loading,
  onSubmit,
  children,
}: Props) {
  const t = useTranslations()

  return (
    <Card className="bg-card/80 shadow-sm backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <FileText className="size-4" />
          </span>
          <div>
            <CardTitle>{t('Generator.inputTitle')}</CardTitle>
            <CardDescription>{t('Generator.inputDescription')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <span
              id="category-label"
              className="mb-2 block text-sm font-medium"
            >
              {t('Generator.category')}
            </span>
            <ToggleGroup
              aria-labelledby="category-label"
              variant="outline"
              size="sm"
              className="flex-wrap"
              value={[category]}
              onValueChange={(value) => {
                // 再點一次已選的項目會回傳空陣列，保持原本的選擇
                if (value.length > 0) onCategoryChange(value[0])
              }}
            >
              {CATEGORIES.map((c) => (
                <ToggleGroupItem
                  key={c.value}
                  value={c.value}
                  className={pillClassName}
                >
                  {t(`Categories.${c.key}`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <span
              id="language-label"
              className="mb-2 block text-sm font-medium"
            >
              {t('Generator.outputLanguage')}
            </span>
            <ToggleGroup
              aria-labelledby="language-label"
              variant="outline"
              size="sm"
              value={[outputLanguage]}
              onValueChange={(value) => {
                if (value.length > 0)
                  onOutputLanguageChange(value[0] as OutputLanguage)
              }}
            >
              {LANGUAGES.map((l) => (
                <ToggleGroupItem
                  key={l}
                  value={l}
                  lang={l}
                  className={pillClassName}
                >
                  {t(`Languages.${l}`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div>
            <label
              htmlFor="resume-content"
              className="mb-2 block text-sm font-medium"
            >
              {t('Generator.experience')}
            </label>
            <Textarea
              id="resume-content"
              value={resumeContent}
              onChange={(e) => onResumeContentChange(e.target.value)}
              placeholder={t('Generator.experiencePlaceholder')}
              rows={6}
              className="max-h-96 min-h-32 [@media(min-height:860px)]:min-h-40"
              required
              minLength={10}
              maxLength={LIMITS.resumeContent}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                {t('Generator.generating')}
              </>
            ) : (
              <>
                <Wand2 />
                {t('Generator.generate')}
              </>
            )}
          </Button>
        </form>

        {children}
      </CardContent>
    </Card>
  )
}
