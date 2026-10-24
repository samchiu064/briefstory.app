// STAR 每個段落的字母標記顏色，與 public/features 插圖一致；key 對應 messages 裡的 Star.*
export const STAR_STEPS = [
  { letter: 'S', key: 'situation', color: 'bg-indigo-500' },
  { letter: 'T', key: 'task', color: 'bg-violet-500' },
  { letter: 'A', key: 'action', color: 'bg-sky-500' },
  { letter: 'R', key: 'result', color: 'bg-emerald-500' },
] as const
