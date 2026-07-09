import { STATUS_LABEL, type ReportStatus } from '../../types'
import { cn } from '../../lib/cn'

export type StatusFilter = ReportStatus | 'all'
// 미처리 경과일 필터 (미처리 신고가 며칠 이상 지났는지)
export type AgeFilter = 'all' | 3 | 7 | 14 | 30

interface FilterBarProps {
  status: StatusFilter
  age: AgeFilter
  onStatus: (v: StatusFilter) => void
  onAge: (v: AgeFilter) => void
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'received', label: STATUS_LABEL.received },
  { value: 'done', label: STATUS_LABEL.done },
]

const AGE_OPTIONS: { value: AgeFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 3, label: '3일↑' },
  { value: 7, label: '7일↑' },
  { value: 14, label: '14일↑' },
  { value: 30, label: '30일↑' },
]

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'border px-2.5 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-esg-600 bg-esg-600 text-white'
          : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400',
      )}
    >
      {children}
    </button>
  )
}

export function FilterBar({ status, age, onStatus, onAge }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="mb-1.5 text-xs font-semibold text-neutral-500">상태</div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              active={status === o.value}
              onClick={() => onStatus(o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-xs font-semibold text-neutral-500">
          미처리 경과
        </div>
        <div className="flex flex-wrap gap-1.5">
          {AGE_OPTIONS.map((o) => (
            <Chip key={o.value} active={age === o.value} onClick={() => onAge(o.value)}>
              {o.label}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  )
}
