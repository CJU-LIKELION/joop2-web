// 신고별 쓰레기 사진 URL.
// - 사용자가 사진 URL을 입력했으면 그것을 사용
// - 없으면 id 기반으로 고정된 쓰레기(garbage/litter) 이미지를 생성 (loremflickr)

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

// 1차: 쓰레기 키워드 이미지
export function reportPhotoUrl(report: { id: string; photoUrl?: string }): string {
  if (report.photoUrl) return report.photoUrl
  const lock = hash(report.id) % 50
  return `https://loremflickr.com/400/300/garbage,trash,litter?lock=${lock}`
}

// 2차 폴백: 1차 로드 실패 시 사용할 안정적인 이미지
export function reportPhotoFallbackUrl(report: { id: string }): string {
  return `https://picsum.photos/seed/${encodeURIComponent(report.id)}/400/300`
}
