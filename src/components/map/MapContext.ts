import { createContext, useContext } from 'react'

export interface MapContextValue {
  kakao: typeof window.kakao
  map: any // kakao.maps.Map 인스턴스
}

export const MapContext = createContext<MapContextValue | null>(null)

// MapBase 내부에서만 사용 — 지도 준비 완료 후 접근
export function useMap(): MapContextValue {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMap 은 MapBase 하위에서만 사용할 수 있습니다.')
  return ctx
}
