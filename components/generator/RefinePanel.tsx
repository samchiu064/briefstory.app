import { Loader2, MessageSquarePlus, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LIMITS } from '@/lib/limits'

interface Props {
  value: string
  onChange: (value: string) => void
  refining: boolean
  onRefine: () => void
}

export function RefinePanel({ value, onChange, refining, onRefine }: Props) {
  const t = useTranslations('Generator')

  return (
    <div className="mt-6 space-y-3 rounded-lg border border-dashed bg-muted/40 p-4">
      <label
        htmlFor="refine-input"
        className="flex items-center gap-2 text-sm font-medium"
      >
        <MessageSquarePlus className="size-4 text-primary" />
        {t('refineLabel')}
      </label>
      <Textarea
        id="refine-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={LIMITS.additionalContext}
        placeholder={t('refinePlaceholder')}
        rows={2}
        className="bg-background text-sm"
      />
      <Button
        onClick={onRefine}
        disabled={refining || !value.trim()}
        variant="secondary"
        className="w-full"
      >
        {refining ? (
          <>
            <Loader2 className="animate-spin" />
            {t('refining')}
          </>
        ) : (
          <>
            <Sparkles />
            {t('refine')}
          </>
        )}
      </Button>
    </div>
  )
}
