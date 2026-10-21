import { NextRequest, NextResponse } from 'next/server'
import { generateText, Output } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { languageEnum, categoryEnum, NewStory } from '@/db/schema'
import { StarStoryOutputSchema } from '@/types/story'
import { createStory } from '@/lib/dal/stories'

// 1. 定義前端發送過來的 Request Payload 規格
const GenerateRequestSchema = z.object({
  resumeContent: z.string().min(10, '履歷內容至少需要 10 個字'),
  outputLanguage: z.enum(languageEnum.enumValues).default('en'),
  category: z.enum(categoryEnum.enumValues).default('General'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parseResult = GenerateRequestSchema.safeParse(body)

    // Validate with Zod
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid parameters',
          details: z.treeifyError(parseResult.error),
        },
        { status: 400 },
      )
    }

    const { resumeContent, outputLanguage, category } = parseResult.data
    const languageInstruction =
      outputLanguage === 'en'
        ? 'CRITICAL: You MUST write the ENTIRE output in ENGLISH.'
        : '重要規範：請務必使用【繁體中文 (Traditional Chinese)】編寫所有內容。'

    const { output: aiResult } = await generateText({
      model: openai('gpt-4o-mini'),
      output: Output.object({
        schema: StarStoryOutputSchema,
      }),
      instructions: `
        You are an elite Tech Interview Coach specializing in Behavioral Interviews.
        Your mission is to transform noisy or unstructured resume bullet points into a high-impact, highly structured STAR story.

        Target Behavioral Category: ${category}
        ${languageInstruction}

        Guidelines:
        1. "Action" MUST focus on personal contributions (e.g., "I designed...", "I led...") rather than passive team statements.
        2. "Memory Anchors" MUST be exactly 4 short, punchy keywords/phrases to prevent rote memorization during interviews.
        3. If crucial context (like metrics or conflict details) is missing, provide constructive questions in "followUpQuestions".`,
      prompt: `User's Resume Bullet Points:\n${resumeContent}`,
    })

    if (!aiResult) {
      throw new Error('AI failed to output standard structured format.')
    }

    // 組裝寫入 DB 的 NewStory 物件
    const newStoryData: NewStory = {
      title: aiResult.title,
      rawInput: resumeContent,
      category: category,
      outputLanguage: outputLanguage,
      situation: aiResult.situation,
      task: aiResult.task,
      action: aiResult.action,
      result: aiResult.result,
      memoryAnchors: aiResult.memoryAnchors,
      followUpQuestions: aiResult.followUpQuestions ?? [],
    }

    // 呼叫 DAL 寫入資料庫
    const insertedStory = await createStory(newStoryData)

    return NextResponse.json({
      success: true,
      data: insertedStory,
    })
  } catch (error) {
    console.error('Error generating STAR story:', error)
    return NextResponse.json(
      { error: 'Failed to generate story with AI' },
      { status: 500 },
    )
  }
}
