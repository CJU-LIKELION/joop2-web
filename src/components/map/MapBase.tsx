import { useEffect, useRef, useState, type ReactNode } from 'react'
import { IconMapPinOff } from '@tabler/icons-react'
import { loadKakaoMaps } from '../../lib/kakaoLoader'
import { CJU_CENTER, DEFAULT_LEVEL } from '../../lib/mapConfig'
import { MapContext, type MapContextValue } from './MapContext'

interface MapBaseProps {
  // 지도 클릭 콜백 (신고 위치 지정 등)
  onMapClick?: (lat: number, lng: number) => void
  // 지도 위에 얹을 오버레이 (마커 레이어, 패널 등)
  children?: ReactNode
  // 마커/클러스터 레이어 (지도 준비 후 렌더)
  layers?: ReactNode
  // 값이 바뀌면 해당 좌표로 부드럽게 이동
  panTo?: { lat: number; lng: number } | null
}

type LoadState = 'loading' | 'ready' | 'error'

export function MapBase({ onMapClick, children, layers, panTo }: MapBaseProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<LoadState>('loading')
  const [ctx, setCtx] = useState<MapContextValue | null>(null)

  // onMapClick 최신값 유지 (지도 재생성 없이 콜백만 갱신)
  const clickRef = useRef(onMapClick)
  clickRef.current = onMapClick

  useEffect(() => {
    let canceled = false

    loadKakaoMaps()
      .then((kakao) => {
        if (canceled || !containerRef.current) return
        const map = new kakao.maps.Map(containerRef.current, {
          center: new kakao.maps.LatLng(CJU_CENTER.lat, CJU_CENTER.lng),
          level: DEFAULT_LEVEL,
        })

        kakao.maps.event.addListener(map, 'click', (e: any) => {
          const latlng = e.latLng
          clickRef.current?.(latlng.getLat(), latlng.getLng())
        })

        setCtx({ kakao, map })
        setState('ready')
      })
      .catch((err) => {
        console.error('[MapBase]', err)
        if (!canceled) setState('error')
      })

    return () => {
      canceled = true
    }
  }, [])

  // panTo 변경 시 해당 좌표로 이동
  useEffect(() => {
    if (!ctx || !panTo) return
    ctx.map.panTo(new ctx.kakao.maps.LatLng(panTo.lat, panTo.lng))
  }, [ctx, panTo])

  return (
    <div className="relative h-full w-full">
      {/* 지도 컨테이너 */}
      <div ref={containerRef} className="h-full w-full" />

      {/* 키 없음/로드 실패 placeholder */}
      {state === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-500">
          <IconMapPinOff size={40} />
          <p className="text-sm font-medium">지도를 불러올 수 없습니다.</p>
          <p className="text-xs">
            .env 의 VITE_KAKAO_MAP_KEY 와 카카오 콘솔의 도메인 등록을 확인해주세요.
          </p>
        </div>
      )}

      {/* 로딩 표시 */}
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-sm text-neutral-500">
          지도를 불러오는 중…
        </div>
      )}

      {/* 지도 준비 후 레이어 + 오버레이 */}
      {state === 'ready' && ctx && (
        <MapContext.Provider value={ctx}>
          {layers}
          {children}
        </MapContext.Provider>
      )}
    </div>
  )
}
