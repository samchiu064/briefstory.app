import { db } from '@/db'
import { stories, type NewStory, type Story } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * 新增一筆 STAR 面試故事
 */
export async function createStory(data: NewStory): Promise<Story> {
  const [newStory] = await db.insert(stories).values(data).returning()

  return newStory
}

/**
 * 根據 ID 取得單一故事
 */
export async function getStoryById(id: string): Promise<Story | undefined> {
  const [story] = await db.select().from(stories).where(eq(stories.id, id))

  return story
}

/**
 * 取得指定使用者的所有故事 (依建立時間倒序)
 */
export async function getStoriesByUserId(userId: string): Promise<Story[]> {
  return await db
    .select()
    .from(stories)
    .where(eq(stories.userId, userId))
    .orderBy(stories.createdAt)
}
