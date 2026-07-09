// 간단한 className 결합 유틸 (falsy 값 제거)
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
