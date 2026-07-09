import { create } from 'zustand'
import type { Report, ReportCategory, ReportStatus } from '../types'
import { SEED_REPORTS } from '../mocks/reports'

// 신고 생성 시 입력값 (id/status/createdAt은 스토어가 채움)
export interface NewReportInput {
  title: string
  description: string
  category: ReportCategory
  lat: number
  lng: number
  photoUrl?: string
}

interface ReportsState {
  reports: Report[]
  addReport: (input: NewReportInput) => Report
  updateStatus: (id: string, status: ReportStatus) => void
  // 시민이 치우고 처리 후 사진을 올려 완료 처리
  resolveReport: (id: string, resolvedPhotoUrl: string) => void
}

export const useReportsStore = create<ReportsState>((set) => ({
  reports: SEED_REPORTS,
  addReport: (input) => {
    const report: Report = {
      id: `r-${Date.now()}`,
      status: 'received',
      createdAt: new Date().toISOString(),
      ...input,
    }
    set((state) => ({ reports: [report, ...state.reports] }))
    return report
  },
  updateStatus: (id, status) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
  resolveReport: (id, resolvedPhotoUrl) =>
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'done',
              resolvedPhotoUrl,
              resolvedAt: new Date().toISOString(),
            }
          : r,
      ),
    })),
}))
