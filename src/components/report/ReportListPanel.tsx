import { IconX, IconClock, IconTrashOff } from '@tabler/icons-react'
import { Button } from '../ui/Button'
import { ReportPhoto } from './ReportPhoto'
import { formatDateTime } from '../../lib/formatDate'
import type { Report } from '../../types'

interface ReportListPanelProps {
  reports: Report[]
  onClose: () => void
  // "치우기" — 다른 시민이 처리하러 감
  onCleanup: (report: Report) => void
}

// 마커/클러스터 클릭 시 우측에 뜨는 신고 목록 패널 (미처리 신고만)
export function ReportListPanel({ reports, onClose, onCleanup }: ReportListPanelProps) {
  if (reports.length === 0) return null

  return (
    <div className="pointer-events-auto absolute right-0 top-0 z-20 flex h-full w-96 max-w-[85vw] flex-col border-l border-neutral-800 bg-white shadow-xl">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-3">
        <h2 className="text-base font-bold text-neutral-900">
          신고 {reports.length}건
        </h2>
        <button
          onClick={onClose}
          className="text-neutral-500 hover:text-neutral-900"
          aria-label="닫기"
        >
          <IconX size={20} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ul>
          {reports.map((r) => (
            <li key={r.id} className="border-b border-neutral-100">
              <ReportPhoto report={r} className="h-40 w-full border-b border-neutral-200" />
              <div className="p-4">
                <h3 className="mb-1 text-sm font-bold text-neutral-900">{r.title}</h3>
                {r.description && (
                  <p className="text-sm text-neutral-600">{r.description}</p>
                )}
                <p className="mt-2 flex items-center gap-1 text-xs text-neutral-400">
                  <IconClock size={13} />
                  {formatDateTime(r.createdAt)}
                </p>

                <Button
                  className="mt-3 w-full"
                  icon={<IconTrashOff size={18} />}
                  onClick={() => onCleanup(r)}
                >
                  치우기
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
