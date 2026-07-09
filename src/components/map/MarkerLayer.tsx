import { useEffect, useRef } from 'react'
import { useMap } from './MapContext'
import { pinDataUri, PIN_SIZE, PIN_ANCHOR } from '../../lib/markerIcon'
import type { Report } from '../../types'

// 클러스터(뭉탱이) 원형 스타일 — 건수별 색상
// 1~4: 초록 / 5~9: 주황 / 10+: 빨강 (calculator 임계값 [5, 10])
const clusterStyle = (size: number, background: string, fontSize: string) => ({
  width: `${size}px`,
  height: `${size}px`,
  background,
  border: '2px solid #fff',
  borderRadius: '50%',
  color: '#fff',
  fontSize,
  fontWeight: '700',
  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  // 숫자 정확히 중앙 정렬
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
})

const CLUSTER_STYLES = [
  clusterStyle(38, 'rgba(22,163,74,0.92)', '14px'), // 1~4 초록(ESG)
  clusterStyle(44, 'rgba(249,115,22,0.95)', '15px'), // 5~9 주황
  clusterStyle(50, 'rgba(239,68,68,0.95)', '16px'), // 10+ 빨강
]
const CLUSTER_CALCULATOR = [5, 10]

interface MarkerLayerProps {
  reports: Report[]
  // 마커 클릭 → 해당 1건, 클러스터(뭉탱이) 클릭 → 그 안의 여러 건
  onSelect?: (reports: Report[]) => void
}

// 신고 마커를 렌더하고 MarkerClusterer 로 묶는다.
// - 줌아웃: 인접 마커가 하나의 클러스터(건수 표시)로 뭉침
// - 줌인: 개별 마커로 분리
// - 클러스터 클릭: 줌 대신 그 안의 신고 목록을 onSelect 로 전달
export function MarkerLayer({ reports, onSelect }: MarkerLayerProps) {
  const { kakao, map } = useMap()
  const clustererRef = useRef<any>(null)
  // 마커 → 신고 매핑 (클러스터 클릭 시 역추적용)
  const markerToReport = useRef(new Map<any, Report>())

  // onSelect 최신값 유지
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect

  // 클러스터러는 한 번만 생성
  useEffect(() => {
    const clusterer = new kakao.maps.MarkerClusterer({
      map,
      averageCenter: true,
      minLevel: 4, // 이 레벨 이상(축소)에서 클러스터링 시작
      gridSize: 80,
      disableClickZoom: true, // 클러스터 클릭 시 확대 대신 패널 표시
      styles: CLUSTER_STYLES,
      calculator: CLUSTER_CALCULATOR, // [5,10] → 색 3단계
    })

    // 클러스터(뭉탱이) 클릭 → 내부 마커들을 신고로 역추적해 전달
    kakao.maps.event.addListener(clusterer, 'clusterclick', (cluster: any) => {
      const markers = cluster.getMarkers() as any[]
      const found = markers
        .map((m) => markerToReport.current.get(m))
        .filter((r): r is Report => Boolean(r))
      selectRef.current?.(found)
    })

    clustererRef.current = clusterer
    return () => {
      clusterer.clear()
      clustererRef.current = null
    }
  }, [kakao, map])

  // reports 변경 시 마커 재생성
  useEffect(() => {
    const clusterer = clustererRef.current
    if (!clusterer) return

    // 모든 개별 마커 공통 이미지 (숫자 "1" 사각형)
    const markerImage = new kakao.maps.MarkerImage(
      pinDataUri('1'),
      new kakao.maps.Size(PIN_SIZE.width, PIN_SIZE.height),
      { offset: new kakao.maps.Point(PIN_ANCHOR.x, PIN_ANCHOR.y) },
    )

    markerToReport.current.clear()
    const markers = reports.map((report) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(report.lat, report.lng),
        title: report.title,
        image: markerImage,
      })
      markerToReport.current.set(marker, report)
      // 개별 마커 클릭 → 해당 1건
      kakao.maps.event.addListener(marker, 'click', () => {
        selectRef.current?.([report])
      })
      return marker
    })

    clusterer.clear()
    clusterer.addMarkers(markers)

    return () => {
      clusterer.clear()
    }
  }, [kakao, reports])

  return null
}
