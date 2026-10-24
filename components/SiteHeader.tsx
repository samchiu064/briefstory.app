import Image from 'next/image'
import { LanguageToggle } from '@/components/LanguageToggle'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SITE_NAME } from '@/lib/site'

export function SiteHeader() {
  return (
    <nav className="flex items-center justify-between py-4">
      <a
        href="#"
        className="flex items-center gap-2 text-xl font-bold tracking-tight"
      >
        {/* 圖示用 SVG，名稱用文字：文字顏色跟著主題變，不需要深色版圖檔 */}
        <Image
          src="/logo-mark.svg"
          alt=""
          width={64}
          height={64}
          className="size-6"
        />
        {SITE_NAME}
      </a>
      <div className="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </nav>
  )
}
