// value 必須與 db/schema.ts 的 categoryEnum 一致（API 會驗證）；key 對應 messages 裡的 Categories.*
export const CATEGORIES = [
  { value: 'Leadership', key: 'leadership' },
  { value: 'Conflict Resolution', key: 'conflictResolution' },
  { value: 'Technical Challenge', key: 'technicalChallenge' },
  { value: 'Failure & Growth', key: 'failureGrowth' },
  { value: 'Cross-Functional', key: 'crossFunctional' },
  { value: 'General', key: 'general' },
] as const

export function categoryKey(value: string | null | undefined) {
  return CATEGORIES.find((c) => c.value === value)?.key ?? 'general'
}
