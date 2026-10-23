'use client'

import { useState } from 'react'
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
import { Tv, Eye, EyeOff, RotateCcw } from 'lucide-react'
import type { Story } from '@/db/schema'

interface Props {
  story: Story
}

export function TeleprompterModal({ story }: Props) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: 'outline',
          className: 'w-full gap-2 border-primary/40 hover:bg-primary/5',
        })}
      >
        <Tv className="h-4 w-4 text-primary" />
        開啟提詞卡訓練模式 (Teleprompter)
      </DialogTrigger>
      <DialogContent className="max-w-2xl sm:max-w-3xl p-8">
        <DialogHeader className="mb-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{story.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {story.outputLanguage}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold mt-2">
            {story.title}
          </DialogTitle>
        </DialogHeader>

        {/* 核心提詞區：極大化 Memory Anchors */}
        <div className="bg-slate-950 text-slate-50 p-8 rounded-xl shadow-inner space-y-6">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold text-center">
            ⚓ Memory Anchors (心智骨架)
          </p>

          <div className="grid grid-cols-2 gap-4">
            {story.memoryAnchors.map((anchor, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5 text-center transition-all hover:border-primary/50"
              >
                <span className="text-xs text-sky-400 font-mono font-semibold block mb-1">
                  0{index + 1}
                </span>
                <span className="text-xl md:text-2xl font-bold tracking-wide text-slate-100">
                  {anchor}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-slate-400 hover:text-slate-100 hover:bg-slate-900"
            >
              {showDetails ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" /> 隱藏 STAR 完整回答
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" /> 顯示 STAR 完整回答對照
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 展開之 STAR 細節對照 */}
        {showDetails && (
          <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 space-y-3 text-sm max-h-[250px] overflow-y-auto">
            <div>
              <strong className="text-primary block">Situation:</strong>
              <p className="text-muted-foreground">{story.situation}</p>
            </div>
            <div>
              <strong className="text-primary block">Task:</strong>
              <p className="text-muted-foreground">{story.task}</p>
            </div>
            <div>
              <strong className="text-primary block">Action:</strong>
              <ul className="list-disc list-inside text-muted-foreground">
                {story.action.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-primary block">Result:</strong>
              <p className="text-muted-foreground">{story.result}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
