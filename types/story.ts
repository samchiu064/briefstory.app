import { z } from 'zod'

// 定義 AI 輸出的 Structured Output Schema
export const StarStoryOutputSchema = z.object({
  title: z
    .string()
    .describe('故事標題，例如：0-to-1 全球 EDM 平台交付 (簡短有影響力)'),
  situation: z.string().describe('S: 專案背景、規模與當時面臨的挑戰痛點'),
  task: z.string().describe('T: 你的核心責任與必須達成的具體目標'),
  action: z
    .array(z.string())
    .length(3)
    .describe('A: 3 個關鍵行動步驟，強調【個人貢獻】而非僅團隊做什麼'),
  result: z.string().describe('R: 量化數據成果、商業效益或團隊學習'),
  memoryAnchors: z
    .array(z.string())
    .length(4)
    .describe('4 個極簡短關鍵字骨架 (Memory Anchors)，方便面試前快速提詞'),
  followUpQuestions: z
    .array(z.string())
    .describe(
      '提示使用者可以補全哪些細節讓故事更具說服力 (2~3 個問題)；若資訊已足夠則回傳空陣列',
    ),
})

export type StarStoryOutput = z.infer<typeof StarStoryOutputSchema>
