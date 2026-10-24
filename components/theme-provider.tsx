'use client'

import { type ComponentProps } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      // next-themes 會渲染一段 inline script 來避免主題閃爍。這段 script 只需要在伺服器
      // 輸出的 HTML 裡執行；切換語言時 layout 會在瀏覽器重新渲染，React 19 會對
      // 「在 client 端渲染的可執行 script」發出警告。在 client 端改成不可執行的 type
      // 就不會觸發警告（next-themes 已在該元素上加了 suppressHydrationWarning）。
      scriptProps={
        typeof window === 'undefined' ? undefined : { type: 'application/json' }
      }
    >
      {children}
    </NextThemesProvider>
  )
}
