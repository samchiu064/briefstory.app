import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'

// 1. 定義故事分類 Enum (對應面試常見行為情境)
export const categoryEnum = pgEnum('story_category', [
  'Leadership',
  'Conflict Resolution',
  'Technical Challenge',
  'Failure & Growth',
  'Cross-Functional',
  'General',
])

// 2. 定義產出語言 Enum
export const languageEnum = pgEnum('output_language', ['en', 'zh-TW'])

// 3. 核心 Stories 資料表
export const stories = pgTable('stories', {
  id: uuid().primaryKey().defaultRandom(),

  // 使用者關聯 (若未來加入 NextAuth/Clerk，無登入時可先留空或用 session ID)
  userId: text('user_id'),

  // 輸入與基本設定
  title: text('title').notNull(),
  rawInput: text('raw_input').notNull(),
  category: categoryEnum('category').default('General'),
  outputLanguage: languageEnum('output_language').notNull().default('en'),

  // STAR 結構化內容 (分別儲存，方便前端獨立渲染)
  situation: text('situation').notNull(),
  task: text('task').notNull(),
  action: jsonb('action').$type<string[]>().notNull(), // 存成字串陣列 [Action 1, Action 2...]
  result: text('result').notNull(),

  // 記憶關鍵字 (Memory Anchors)
  memoryAnchors: jsonb('memory_anchors').$type<string[]>().notNull(),

  // AI 追問/建議
  followUpQuestions: jsonb('follow_up_questions').$type<string[]>(),

  // 時間戳記
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Story = typeof stories.$inferSelect
export type NewStory = typeof stories.$inferInsert
