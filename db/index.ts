import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in environment variables.')
}

// 建立 Neon HTTP Client (本地與 Vercel 通用)
const sql = neon(process.env.DATABASE_URL)

  // 統一使用 neon-http 匯出 db 實例
export const db = drizzle(sql, {
  schema,
  casing: 'snake_case',
})
