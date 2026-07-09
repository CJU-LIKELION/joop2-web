import { useMemo, useState } from 'react'
import { MapBase } from '../components/map/MapBase'
import { MarkerLayer } from '../components/map/MarkerLayer'
import { ReportOverlay } from '../components/report/ReportOverlay'
import { ReportForm } from '../components/report/ReportForm'
import { ReportListPanel } from '../components/report/ReportListPanel'
import { CleanupModal } from '../components/report/CleanupModal'
import { useReportsStore, type NewReportInput } from '../store/reportsStore'
import { useMileageStore } from '../store/mileageStore'
import { REPORT_REWARD, CLEANUP_REWARD, type Report } from '../types'

export default function CitizenMap() {
  const reports = useReportsStore((s) => s.reports)
  const addReport = useReportsStore((s) => s.addReport)
  const resolveReport = useReportsStore((s) => s.resolveReport)
  const earn = useMileageStore((s) => s.earn)

  const [picking, setPicking] = useState(false)
  const [locating, setLocating] = useState(false)
  const [coord, setCoord] = useState<{ lat: number; lng: number } | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [panTo, setPanTo] = useState<{ lat: number; lng: number } | null>(null)
  // 마커/클러스터 클릭으로 선택된 신고 id들 (스토어와 동기화 위해 id로 보관)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  // 치우기 대상 신고
  const [cleanupTarget, setCleanupTarget] = useState<Report | null>(null)

  // 미처리 신고만 지도에 표시 (완료되면 사라짐)
  const openReports = useMemo(
    () => reports.filter((r) => r.status !== 'done'),
    [reports],
  )

  // 선택된 id → 최신 미처리 신고 (처리하면 목록에서 즉시 사라짐)
  const selectedReports = useMemo(
    () => openReports.filter((r) => selectedIds.includes(r.id)),
    [openReports, selectedIds],
  )

  const openFormAt = (lat: number, lng: number) => {
    setCoord({ lat, lng })
    setFormOpen(true)
  }

  // 신고하기 → 현재 위치 먼저 시도, 실패/거부 시 지도 클릭으로 폴백
  const handleStart = () => {
    setSelectedIds([])
    if (!('geolocation' in navigator)) {
      setPicking(true)
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setPanTo({ lat, lng })
        openFormAt(lat, lng)
      },
      () => {
        setLocating(false)
        setPicking(true)
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    )
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (!picking) return
    setPicking(false)
    openFormAt(lat, lng)
  }

  const handleSubmit = (input: NewReportInput) => {
    addReport(input)
    earn(REPORT_REWARD)
    setFormOpen(false)
    setCoord(null)
  }

  // 치우기 완료 처리 → 상태 완료 + 처리 후 사진 저장 + 마일리지 적립
  const handleCleanupConfirm = (resolvedPhotoUrl: string) => {
    if (!cleanupTarget) return
    resolveReport(cleanupTarget.id, resolvedPhotoUrl)
    earn(CLEANUP_REWARD)
    setCleanupTarget(null)
  }

  return (
    <div className="h-full">
      <MapBase
        onMapClick={handleMapClick}
        panTo={panTo}
        layers={<MarkerLayer reports={openReports} onSelect={(rs) => setSelectedIds(rs.map((r) => r.id))} />}
      >
        <ReportOverlay
          picking={picking}
          locating={locating}
          onStart={handleStart}
          onCancel={() => setPicking(false)}
        />

        {/* 마커/클러스터 클릭 시 우측 신고 목록 패널 */}
        <ReportListPanel
          reports={selectedReports}
          onClose={() => setSelectedIds([])}
          onCleanup={setCleanupTarget}
        />
      </MapBase>

      <ReportForm
        open={formOpen}
        coord={coord}
        onClose={() => {
          setFormOpen(false)
          setCoord(null)
        }}
        onSubmit={handleSubmit}
        onRepick={() => {
          setFormOpen(false)
          setPicking(true)
        }}
      />

      {/* 치우기 완료 처리 모달 */}
      <CleanupModal
        report={cleanupTarget}
        onClose={() => setCleanupTarget(null)}
        onConfirm={handleCleanupConfirm}
      />
    </div>
  )
}
