import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { AUTHOR, COPYRIGHT_YEAR, SITE_NAME } from '@/lib/site'

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
        <p>
          {t.rich('copyright', {
            year: COPYRIGHT_YEAR,
            name: AUTHOR.name,
            link: (chunks) => (
              <a
                href={AUTHOR.url}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
    </footer>
  )
}
