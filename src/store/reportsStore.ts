import { create } from 'zustand'
import type { Report, ReportCategory, ReportStatus } from '../types'
import { SEED_REPORTS } from '../mocks/reports'

/*
 * [백엔드 연동 지점 — 신고(Report)]
 * 현재는 mock(SEED_REPORTS) + 메모리 상태로 동작.
 * 실제 엔드포인트는 백엔드와 아직 미합의 → api 클라이언트(src/lib/api.ts)를 통해
 * 아래 각 지점에서 서버 호출로 교체 예정. (목록조회 / 신고등록 / 상태변경 / 치우기완료)
 */

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
  // TODO(API): 목록 조회로 초기화 (지금은 mock)
  reports: SEED_REPORTS,

  // TODO(API): 신고 등록 요청 후 서버 결과 반영 (지금은 클라이언트에서 id/시각 임시 생성)
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

  // TODO(API): 상태 변경 요청 후 반영 (담당부서)
  updateStatus: (id, status) =>
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, status } : r)),
    })),

  // TODO(API): 치우기 완료(처리 후 사진 업로드) 요청 후 반영
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
