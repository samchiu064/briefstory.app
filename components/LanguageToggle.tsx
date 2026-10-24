'use client'

import { useTransition } from 'react'
import { Check, Languages } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LanguageToggle() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            disabled={isPending}
            title={t('LanguageToggle.label')}
          />
        }
      >
        <Languages className="size-5" />
        <span className="sr-only">{t('LanguageToggle.label')}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            // lang 讓螢幕閱讀器用正確的語言念出選項名稱
            lang={l}
            onClick={() =>
              // 換成同一頁的另一個語系路徑，例如 /en → /zh-TW
              startTransition(() => router.replace(pathname, { locale: l }))
            }
          >
            {t(`Languages.${l}`)}
            {l === locale && <Check className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
