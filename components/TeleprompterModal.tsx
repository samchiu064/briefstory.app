'use client'

import { useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tv, Eye, EyeOff, Anchor } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Story } from '@/db/schema'
import { categoryKey } from '@/lib/categories'
import { STAR_STEPS } from '@/lib/star'
import { cn } from '@/lib/utils'

interface Props {
  story: Story
}

export function TeleprompterModal({ story }: Props) {
  const [showDetails, setShowDetails] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const t = useTranslations()

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: 'outline',
          className: 'w-full gap-2 border-primary/40 hover:bg-primary/5',
        })}
      >
        <Tv className="h-4 w-4 text-primary" />
        {t('Teleprompter.open')}
      </DialogTrigger>

      {/* 桌面固定高度：展開/收合回答時 dialog 不會改變大小或位置 */}
      <DialogContent
        // 開啟時聚焦底部的切換按鈕：它在捲動區之外，手機上不會讓內容一開就捲到中間
        initialFocus={toggleRef}
        className="flex max-h-[90svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl lg:h-[min(90svh,720px)]"
      >
        <DialogHeader className="border-b px-6 pt-6 pb-4 pr-12">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {t(`Categories.${categoryKey(story.category)}`)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t(`Languages.${story.outputLanguage}`)}
            </span>
          </div>
          <DialogTitle className="mt-2 text-xl font-bold sm:text-2xl">
            {story.title}
          </DialogTitle>
        </DialogHeader>

        {/* 版面永遠是兩欄（手機上下堆疊），回答欄的空間一直保留，顯示回答時版面不會位移 */}
        <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-2 lg:overflow-hidden">
          {/* 核心提詞區：極大化 Memory Anchors */}
          <div className="p-6 lg:overflow-y-auto">
            <div className="space-y-6 rounded-xl bg-slate-950 p-6 text-slate-50 shadow-inner sm:p-8 lg:space-y-4 lg:p-5">
              <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                <Anchor className="size-3.5" />
                {t('Teleprompter.memoryAnchors')}
              </p>

              <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {story.memoryAnchors.map((anchor, index) => (
                  <li
                    key={index}
                    className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-center transition-colors hover:border-primary/50 lg:p-3"
                  >
                    <span className="mb-1 block font-mono text-xs font-semibold text-sky-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-xl font-bold tracking-wide text-slate-100 md:text-2xl">
                      {anchor}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* STAR 完整回答：先模糊遮住（像翻牌卡），練習完再顯示對照 */}
          <section
            aria-label={t('Teleprompter.showDetails')}
            className={cn(
              'relative border-t lg:border-t-0 lg:border-l',
              // 遮住時不能捲動，避免滑到模糊的內容
              showDetails ? 'lg:overflow-y-auto' : 'lg:overflow-hidden',
            )}
          >
            <ol
              id="teleprompter-details"
              // 遮住時對螢幕閱讀器與 Tab 鍵隱藏
              aria-hidden={!showDetails}
              inert={!showDetails}
              className={cn(
                'space-y-6 px-6 py-6 transition-[filter,opacity] duration-300 motion-reduce:transition-none',
                !showDetails &&
                  'pointer-events-none opacity-60 blur-md select-none',
              )}
            >
              {STAR_STEPS.map((step, i) => (
                <li key={step.letter} className="relative flex gap-4">
                  {i < STAR_STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-9 -bottom-6 left-3.5 w-px bg-border"
                    />
                  )}
                  <span
                    aria-hidden
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${step.color}`}
                  >
                    {step.letter}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className="mb-1.5 font-semibold">
                      {t(`Star.${step.key}`)}
                    </h3>
                    {step.key === 'action' ? (
                      <ul className="list-disc space-y-1.5 pl-4 leading-relaxed text-muted-foreground">
                        {story.action.map((act, j) => (
                          <li key={j}>{act}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="leading-relaxed text-muted-foreground">
                        {story[step.key]}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {/* 遮罩上的提示與顯示按鈕；淡入淡出，不影響版面 */}
            <div
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-start gap-4 p-6 pt-16 lg:justify-center lg:pt-6 text-center transition-opacity duration-300 motion-reduce:transition-none',
                showDetails ? 'pointer-events-none opacity-0' : 'opacity-100',
              )}
            >
              <p className="max-w-xs text-sm text-muted-foreground">
                {t('Teleprompter.revealHint')}
              </p>
              <Button
                onClick={() => setShowDetails(true)}
                tabIndex={showDetails ? -1 : undefined}
                aria-controls="teleprompter-details"
                aria-expanded={showDetails}
              >
                <Eye />
                {t('Teleprompter.reveal')}
              </Button>
            </div>
          </section>
        </div>

        {/* 切換按鈕固定在底部，捲動時也找得到 */}
        <div className="flex justify-end border-t bg-muted/40 px-6 py-3">
          <Button
            ref={toggleRef}
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            aria-expanded={showDetails}
            aria-controls="teleprompter-details"
          >
            {showDetails ? <EyeOff /> : <Eye />}
            {showDetails
              ? t('Teleprompter.hideDetails')
              : t('Teleprompter.showDetails')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
