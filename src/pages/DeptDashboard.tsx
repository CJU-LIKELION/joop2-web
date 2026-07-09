import { useMemo, useState } from 'react'
import { MapBase } from '../components/map/MapBase'
import { MarkerLayer } from '../components/map/MarkerLayer'
import { DashboardPanel } from '../components/dashboard/DashboardPanel'
import type { StatusFilter, AgeFilter } from '../components/dashboard/FilterBar'
import { useReportsStore } from '../store/reportsStore'
import type { Report } from '../types'

const DAY_MS = 24 * 60 * 60 * 1000

export default function DeptDashboard() {
  const reports = useReportsStore((s) => s.reports)
  const updateStatus = useReportsStore((s) => s.updateStatus)

  const [status, setStatus] = useState<StatusFilter>('all')
  const [age, setAge] = useState<AgeFilter>('all')
  const [panTo, setPanTo] = useState<{ lat: number; lng: number } | null>(null)
  // 지도에서 클릭한 영역(클러스터/마커)의 신고 id들
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // 필터 적용된 신고 (지도 마커용)
  const filtered = useMemo(() => {
    const now = Date.now()
    return reports.filter((r) => {
      if (!(status === 'all' || r.status === status)) return false
      // 미처리 경과 필터: 미처리 신고가 N일 이상 지난 것만
      if (age !== 'all') {
        if (r.status !== 'received') return false
        const days = (now - new Date(r.createdAt).getTime()) / DAY_MS
        if (days < age) return false
      }
      return true
    })
  }, [reports, status, age])

  // 목록: 영역 선택 시 그 영역만, 아니면 필터 전체
  const listReports = useMemo(() => {
    if (selectedIds.length === 0) return filtered
    return filtered.filter((r) => selectedIds.includes(r.id))
  }, [filtered, selectedIds])

  // 지도 마커/클러스터 클릭 → 그 영역만 목록에 표시 + 지도 이동
  const handleMarkerSelect = (picked: Report[]) => {
    setSelectedIds(picked.map((r) => r.id))
    if (picked[0]) setPanTo({ lat: picked[0].lat, lng: picked[0].lng })
  }

  // 목록 항목 클릭 → 지도 이동
  const handleSelect = (report: Report) => {
    setPanTo({ lat: report.lat, lng: report.lng })
  }

  return (
    <div className="flex h-full">
      {/* 지도 (필터 적용 마커) */}
      <div className="min-w-0 flex-1">
        <MapBase
          panTo={panTo}
          layers={<MarkerLayer reports={filtered} onSelect={handleMarkerSelect} />}
        />
      </div>

      {/* 대시보드 패널 */}
      <DashboardPanel
        reports={reports}
        listReports={listReports}
        status={status}
        age={age}
        onStatus={setStatus}
        onAge={setAge}
        onStatusChange={updateStatus}
        onSelect={handleSelect}
        selectionActive={selectedIds.length > 0}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  )
}
