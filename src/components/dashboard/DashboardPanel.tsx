import { IconClock, IconFilterOff } from '@tabler/icons-react'
import { StatCards } from './StatCards'
import { FilterBar, type StatusFilter, type AgeFilter } from './FilterBar'
import { StatusBadge } from '../ui/Badge'
import { ReportPhoto } from '../report/ReportPhoto'
import { cn } from '../../lib/cn'
import { formatDateTime } from '../../lib/formatDate'
import { STATUS_LABEL, type Report, type ReportStatus } from '../../types'

interface DashboardPanelProps {
  reports: Report[] // 전체 (통계용)
  listReports: Report[] // 목록에 표시할 신고 (필터 또는 선택 영역)
  status: StatusFilter
  age: AgeFilter
  onStatus: (v: StatusFilter) => void
  onAge: (v: AgeFilter) => void
  onStatusChange: (id: string, status: ReportStatus) => void
  onSelect?: (report: Report) => void
  // 지도에서 특정 영역(클러스터/마커)을 선택한 상태인지
  selectionActive: boolean
  onClearSelection: () => void
}

const STATUS_STEPS: ReportStatus[] = ['received', 'done']

// 미처리/완료 임의 토글
function StatusToggle({
  current,
  onChange,
}: {
  current: ReportStatus
  onChange: (s: ReportStatus) => void
}) {
  return (
    <div className="flex">
      {STATUS_STEPS.map((s, i) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={cn(
            'flex-1 border py-1 text-xs font-medium transition-colors',
            i > 0 && '-ml-px',
            current === s
              ? 'border-esg-600 bg-esg-600 text-white'
              : 'border-neutral-300 bg-white text-neutral-500 hover:border-neutral-400',
          )}
        >
          {STATUS_LABEL[s]}
        </button>
      ))}
    </div>
  )
}

export function DashboardPanel({
  reports,
  listReports,
  status,
  age,
  onStatus,
  onAge,
  onStatusChange,
  onSelect,
  selectionActive,
  onClearSelection,
}: DashboardPanelProps) {
  return (
    <aside className="flex h-full w-96 shrink-0 flex-col border-l border-neutral-800 bg-white">
      <div className="border-b border-neutral-200 p-4">
        <h2 className="mb-3 text-base font-bold text-neutral-900">신고 대시보드</h2>
        <StatCards reports={reports} />
      </div>

      <div className="border-b border-neutral-200 p-4">
        <FilterBar status={status} age={age} onStatus={onStatus} onAge={onAge} />
      </div>

      {/* 신고 목록 */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2 text-xs text-neutral-500">
          <span className="flex items-center gap-2">
            {selectionActive ? '선택한 영역' : '신고 목록'}
            {selectionActive && (
              <button
                onClick={onClearSelection}
                className="flex items-center gap-0.5 border border-neutral-300 px-1.5 py-0.5 text-[11px] text-neutral-600 hover:border-neutral-400"
              >
                <IconFilterOff size={12} />
                선택 해제
              </button>
            )}
          </span>
          <span>{listReports.length}건</span>
        </div>

        {listReports.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-neutral-400">
            {selectionActive ? '선택한 영역에 신고가 없습니다.' : '조건에 맞는 신고가 없습니다.'}
          </p>
        ) : (
          <ul>
            {listReports.map((r) => (
              <li key={r.id} className="border-b border-neutral-100">
                <button onClick={() => onSelect?.(r)} className="block w-full text-left">
                  <ReportPhoto
                    report={r}
                    className="h-32 w-full border-b border-neutral-200"
                  />
                </button>
                <div className="p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <StatusBadge status={r.status} label={STATUS_LABEL[r.status]} />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">{r.title}</h3>
                  {r.description && (
                    <p className="mt-0.5 text-sm text-neutral-600">{r.description}</p>
                  )}
                  <p className="mb-2 mt-1 flex items-center gap-1 text-xs text-neutral-400">
                    <IconClock size={13} />
                    {formatDateTime(r.createdAt)}
                  </p>
                  <StatusToggle
                    current={r.status}
                    onChange={(s) => onStatusChange(r.id, s)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
