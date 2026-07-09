import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { ReportStatus } from '../../types'

const STATUS_STYLE: Record<ReportStatus, string> = {
  received: 'bg-amber-50 text-amber-700 border-amber-300',
  done: 'bg-esg-50 text-esg-700 border-esg-300',
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {children}
    </span>
  )
}

// 신고 상태 전용 뱃지
export function StatusBadge({
  status,
  label,
}: {
  status: ReportStatus
  label: string
}) {
  return <Badge className={STATUS_STYLE[status]}>{label}</Badge>
}
