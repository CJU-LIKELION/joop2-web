// 마커/클러스터를 동일한 "숫자 사각형" 스타일로 통일.
// 개별 마커는 1건이므로 숫자 "1"을 표시하고, 클러스터는 건수를 표시(클러스터러가 처리).

// 둥근 ESG 그린 숫자 원형 SVG
function circleSvg(label: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="16" fill="rgba(22,163,74,0.92)" stroke="#fff" stroke-width="2"/>
    <text x="18" y="18" fill="#fff" font-size="15" font-weight="700"
      font-family="system-ui, sans-serif" text-anchor="middle" dominant-baseline="central">${label}</text>
  </svg>`
}

// data-URI 로 변환 (Kakao MarkerImage src 용)
export function pinDataUri(label = '1'): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(circleSvg(label))}`
}

// 마커 크기/앵커 (중앙 정렬 — 클러스터 사각형과 동일한 느낌)
export const PIN_SIZE = { width: 36, height: 36 }
export const PIN_ANCHOR = { x: 18, y: 18 }
