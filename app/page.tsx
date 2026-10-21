"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, HelpCircle } from "lucide-react";
import type { Story } from "@/db/schema";

export default function PlaygroundPage() {
  const [resumeContent, setResumeContent] = useState("");
  const [category, setCategory] = useState("General");
  const [outputLanguage, setOutputLanguage] = useState<"en" | "zh-TW">("en");
  
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeContent,
          category,
          outputLanguage,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to generate story");
      }

      setStory(json.data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">BriefStory</h1>
        <p className="text-muted-foreground">
          Transform raw resume bullets into high-impact STAR interview answers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左側：輸入表單 */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Resume Input</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Conflict Resolution">Conflict Resolution</SelectItem>
                    <SelectItem value="Technical Challenge">Technical Challenge</SelectItem>
                    <SelectItem value="Failure & Growth">Failure & Growth</SelectItem>
                    <SelectItem value="Cross-Functional">Cross-Functional</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Output Language
                </label>
                <Select
                  value={outputLanguage}
                  onValueChange={(val) => setOutputLanguage(val as "en" | "zh-TW")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh-TW">繁體中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Resume Bullet Points
                </label>
                <Textarea
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  placeholder="Paste your experience here... (e.g., Led Vue 2 to Vue 3 migration in 2 months...)"
                  rows={6}
                  required
                  minLength={10}
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating STAR Story...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Story
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 右側：STAR 故事卡片展示 */}
        <div className="space-y-6">
          {story ? (
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{story.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    Language: {story.outputLanguage}
                  </span>
                </div>
                <CardTitle className="text-xl text-primary">
                  {story.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 記憶關鍵字 (Memory Anchors) */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Memory Anchors (Quick Teleprompter)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {story.memoryAnchors.map((anchor, i) => (
                      <Badge key={i} variant="secondary" className="px-3 py-1 text-sm font-medium">
                        ⚓ {anchor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <hr className="my-2" />

                {/* S: Situation */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Situation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {story.situation}
                  </p>
                </div>

                {/* T: Task */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Task
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {story.task}
                  </p>
                </div>

                {/* A: Action */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Action
                  </h3>
                  <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                    {story.action.map((act, i) => (
                      <li key={i} className="leading-relaxed">
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* R: Result */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Result
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {story.result}
                  </p>
                </div>

                {/* AI Follow-up Questions (若有) */}
                {story.followUpQuestions && story.followUpQuestions.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="flex items-center font-medium gap-1">
                      <HelpCircle className="h-3.5 w-3.5" />
                      Tips to make this story even stronger:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 pl-1">
                      {story.followUpQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full min-h-[300px] flex items-center justify-center text-center p-6 border-dashed">
              <div className="space-y-2 text-muted-foreground">
                <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p>Fill out the form on the left to generate your STAR story.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
