'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import type { Story } from '@/db/schema'
import { StoryForm, type OutputLanguage } from './StoryForm'
import { RefinePanel } from './RefinePanel'
import { StoryResult } from './StoryResult'
import { StoryPlaceholder } from './StoryPlaceholder'

// 頁面上唯一需要互動的區塊：所有狀態與 API 呼叫集中在這裡，子元件只負責顯示
export function StoryGenerator() {
  const t = useTranslations('Generator')
  const locale = useLocale()

  const [resumeContent, setResumeContent] = useState('')
  const [category, setCategory] = useState('General')
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>(
    // 輸出語言預設跟著頁面語言，使用者仍可在表單中更改
    locale,
  )

  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState<Story | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [additionalInput, setAdditionalInput] = useState('')
  const [refining, setRefining] = useState(false)

  const handleRefine = async () => {
    if (!additionalInput.trim() || !story) return
    setRefining(true)

    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalStory: {
            situation: story.situation,
            task: story.task,
            action: story.action,
            result: story.result,
            category: story.category,
            outputLanguage: story.outputLanguage,
          },
          additionalContext: additionalInput,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error)

      // 升級成修訂後的新故事卡片！
      setStory(json.data)
      setAdditionalInput('') // 清空輸入框
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : t('errorRefine'))
    } finally {
      setRefining(false)
    }
  }

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent,
          category,
          outputLanguage,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || t('errorGenerate'))
      }

      setStory(json.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errorUnexpected'))
    } finally {
      setLoading(false)
    }
  }

  return (
    // 還沒有故事時兩張卡片等高；有故事後輸出卡片會變長，改成靠上對齊
    <div
      className={`grid grid-cols-1 gap-6 lg:grid-cols-2 ${story ? 'items-start' : 'items-stretch'}`}
    >
      {/* 左側：輸入表單 */}
      <StoryForm
        category={category}
        onCategoryChange={setCategory}
        outputLanguage={outputLanguage}
        onOutputLanguageChange={setOutputLanguage}
        resumeContent={resumeContent}
        onResumeContentChange={setResumeContent}
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
      >
        {/* 有故事之後才顯示精煉區塊（沒有故事時 handleRefine 不會做任何事） */}
        {story && (
          <RefinePanel
            value={additionalInput}
            onChange={setAdditionalInput}
            refining={refining}
            onRefine={handleRefine}
          />
        )}
      </StoryForm>

      {/* 右側：STAR 故事卡片展示 */}
      {story ? (
        <StoryResult story={story} />
      ) : (
        <StoryPlaceholder loading={loading} />
      )}
    </div>
  )
}
