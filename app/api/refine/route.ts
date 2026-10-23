import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { StarStoryOutputSchema } from "@/types/story";
import { createStory } from "@/lib/dal/stories";
import { languageEnum, categoryEnum } from "@/db/schema";

const RefineRequestSchema = z.object({
  originalStory: z.object({
    situation: z.string(),
    task: z.string(),
    action: z.array(z.string()),
    result: z.string(),
    category: z.enum(categoryEnum.enumValues),
    outputLanguage: z.enum(languageEnum.enumValues),
  }),
  additionalContext: z.string().min(5, "補充資訊至少需要 5 個字"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = RefineRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: z.treeifyError(parseResult.error) },
        { status: 400 }
      );
    }

    const { originalStory, additionalContext } = parseResult.data;

    const languageInstruction =
      originalStory.outputLanguage === "en"
        ? "CRITICAL: You MUST write the ENTIRE refined output strictly in fluent, professional ENGLISH."
        : "重要規範：請務必使用【繁體中文 (Traditional Chinese)】編寫所有內容。";

    // 呼叫 AI 進行精煉修訂
    const { output: aiResult } = await generateText({
      model: openai("gpt-4o-mini"),
      output: Output.object({
        schema: StarStoryOutputSchema,
      }),
      system: `You are an elite Tech Interview Coach specializing in Behavioral Interviews.
Your task is to REFINE and ENHANCE an existing STAR story by incorporating additional user-provided context.

Target Category: ${originalStory.category}
${languageInstruction}

Guidelines:
1. Seamlessly integrate the new details (e.g., metrics, conflict resolution, technical decisions) into the Situation, Task, Action, or Result sections.
2. Update the 4 Memory Anchors to reflect the updated focus if necessary.
3. Keep the tone sharp, impactful, and tailored for senior software engineers.`,
      prompt: `[Original STAR Story]
Situation: ${originalStory.situation}
Task: ${originalStory.task}
Action: ${originalStory.action.join("; ")}
Result: ${originalStory.result}

[User's Additional Context / Refinement Input]
${additionalContext}`,
    });

    if (!aiResult) {
      throw new Error("AI failed to refine story.");
    }

    // 將修訂後的新故事寫入 DB
    const insertedStory = await createStory({
      rawInput: `[Refined] ${additionalContext}`,
      category: originalStory.category,
      outputLanguage: originalStory.outputLanguage,
      title: aiResult.title,
      situation: aiResult.situation,
      task: aiResult.task,
      action: aiResult.action,
      result: aiResult.result,
      memoryAnchors: aiResult.memoryAnchors,
      followUpQuestions: aiResult.followUpQuestions ?? [],
    });

    return NextResponse.json({ success: true, data: insertedStory });
  } catch (error) {
    console.error("Error refining STAR story:", error);
    return NextResponse.json(
      { error: "Failed to refine story" },
      { status: 500 }
    );
  }
}