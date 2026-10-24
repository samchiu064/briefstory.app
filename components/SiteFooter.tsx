import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { COPYRIGHT_YEAR, SITE_NAME } from '@/lib/site'

export function SiteFooter() {
  const t = useTranslations('Footer')

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <Image
            src="/logo-mark.svg"
            alt=""
            width={64}
            height={64}
            className="size-6"
          />
          {SITE_NAME}
        </span>
        <p>{t('copyright', { year: COPYRIGHT_YEAR })}</p>
      </div>
    </footer>
  )
}
