// 前端 textarea 的 maxLength 與 API 的 zod 驗證共用，避免兩邊不一致
export const LIMITS = {
  resumeContent: 5000,
  additionalContext: 2000,
  // refine 時前端會把原本的故事送回來，每個欄位給寬鬆一點的上限
  storyField: 3000,
  actionItems: 10,
  // 限制單次 AI 回應長度，讓每個請求的成本有上限
  maxOutputTokens: 2000,
} as const
