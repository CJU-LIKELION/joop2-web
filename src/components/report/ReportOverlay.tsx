import { IconAlertTriangle, IconX, IconCurrentLocation } from '@tabler/icons-react'
import { Button } from '../ui/Button'

interface ReportOverlayProps {
  picking: boolean
  locating: boolean
  onStart: () => void
  onCancel: () => void
}

// 지도 위 신고 진입 버튼 + 위치 탐색/지정 안내 배너
export function ReportOverlay({ picking, locating, onStart, onCancel }: ReportOverlayProps) {
  return (
    <>
      {/* 현재 위치 탐색 중 배너 */}
      {locating && (
        <div className="pointer-events-auto absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-2 border border-neutral-800 bg-white px-4 py-2 shadow-md">
          <IconCurrentLocation size={18} className="animate-pulse text-esg-600" />
          <span className="text-sm font-medium text-neutral-800">
            현재 위치를 찾는 중…
          </span>
        </div>
      )}

      {/* 위치 지정 모드 안내 배너 (지도 클릭) */}
      {picking && (
        <div className="pointer-events-auto absolute left-1/2 top-4 z-10 flex -translate-x-1/2 items-center gap-3 border border-neutral-800 bg-white px-4 py-2 shadow-md">
          <span className="text-sm font-medium text-neutral-800">
            지도를 클릭해 신고 위치를 지정하세요
          </span>
          <button
            onClick={onCancel}
            className="text-neutral-500 hover:text-neutral-900"
            aria-label="취소"
          >
            <IconX size={18} />
          </button>
        </div>
      )}

      {/* 신고하기 버튼 (우하단) */}
      {!picking && !locating && (
        <div className="pointer-events-auto absolute bottom-6 right-6 z-10">
          <Button
            size="lg"
            onClick={onStart}
            icon={<IconAlertTriangle size={20} />}
            className="shadow-lg"
          >
            신고하기
          </Button>
        </div>
      )}
    </>
  )
}
