import { Card } from '../ui/Card'
import type { Report } from '../../types'

// 전체/미처리/완료 건수 요약
export function StatCards({ reports }: { reports: Report[] }) {
  const total = reports.length
  const received = reports.filter((r) => r.status === 'received').length
  const done = reports.filter((r) => r.status === 'done').length

  const items = [
    { label: '전체', value: total, color: 'text-neutral-900' },
    { label: '미처리', value: received, color: 'text-status-received' },
    { label: '완료', value: done, color: 'text-status-done' },
  ]

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((it) => (
        <Card key={it.label} className="px-3 py-2.5">
          <div className="text-xs text-neutral-500">{it.label}</div>
          <div className={'text-2xl font-bold tabular-nums ' + it.color}>
            {it.value}
          </div>
        </Card>
      ))}
    </div>
  )
}
