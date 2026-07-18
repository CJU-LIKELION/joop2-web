import { create } from 'zustand'
import type { Report, ReportCategory, ReportStatus } from '../types'
import { SEED_REPORTS } from '../mocks/reports'
import { api } from '../lib/api'
import { parseCreateReportResponse, parseLogic2Response } from '../lib/reportApi'
import { buildCreateReportRequest } from '../lib/reportValidation'

/*
 * [백엔드 연동 지점 — 신고(Report)]
 * 전체 목록 API가 아직 없으므로 조회는 /logic2의 최신 신고 1건을 사용합니다.
 * 신고 등록은 /reports API를 사용합니다.
 * 담당부서 상태 변경은 /reports/{reportId}/status API를 사용합니다.
 * 치우기 완료는 계약 확정 전까지 메모리 상태로 동작합니다.
 */

// 신고 생성 시 입력값 (id/status/createdAt은 스토어가 채움)
export interface NewReportInput {
  title: string
  address: string
  description: string
  category: ReportCategory
  lat: number
  lng: number
  photoUrl: string
}

interface ReportsState {
  reports: Report[]
  isLoading: boolean
  loadError: string | null
  fetchReports: () => Promise<void>
  addReport: (input: NewReportInput) => Report
  updateStatus: (id: string, status: ReportStatus) => Promise<void>
  // 시민이 치우고 처리 후 사진을 올려 완료 처리
  resolveReport: (id: string, resolvedPhotoUrl: string) => void
}

let fetchReportsPromise: Promise<void> | null = null

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export const useReportsStore = create<ReportsState>((set) => ({
  // 서버 조회 전 또는 실패 시에는 목 데이터를 fallback으로 유지합니다.
  reports: SEED_REPORTS,
  isLoading: false,
  loadError: null,

  fetchReports: () => {
    if (fetchReportsPromise) return fetchReportsPromise

    set({ isLoading: true, loadError: null })
    fetchReportsPromise = api
      .get<unknown>('/logic2')
      .then((response) => {
        const reports = parseLogic2Response(response)
        set({ reports, isLoading: false, loadError: null })
      })
      .catch((error) => {
        const message = toErrorMessage(error)
        console.error('최근 신고 API 실패 (/logic2), 목 데이터를 사용합니다:', message)
        set({ isLoading: false, loadError: message })
      })
      .finally(() => {
        fetchReportsPromise = null
      })

    return fetchReportsPromise
  },

  // 신고 등록: POST /reports — 화면은 낙관적으로 먼저 반영하고, 서버 응답이 오면 덮어씀
  addReport: (input) => {
    // UI 검증을 우회해도 API 호출 직전에 동일한 스키마로 다시 검증합니다.
    const payload = buildCreateReportRequest(input)
    const report: Report = {
      id: `r-${Date.now()}`,
      title: payload.title,
      description: payload.content,
      address: payload.address,
      category: payload.category,
      lat: payload.latitude,
      lng: payload.longitude,
      photoUrl: payload.imageUrl,
      status: 'received',
      createdAt: new Date().toISOString(),
    }
    set((state) => ({ reports: [report, ...state.reports] }))
    api
      .post<unknown>('/reports', payload)
      .then((response) => {
        const saved = parseCreateReportResponse(response)
        set((state) => ({
          reports: state.reports.map((r) =>
            r.id === report.id
              ? { ...r, id: saved.id, photoUrl: saved.photoUrl ?? r.photoUrl }
              : r,
          ),
        }))
      })
      .catch((err) => {
        console.error('신고 등록 API 실패 (/reports):', err)
      })
    return report
  },

  // 담당부서 상태 변경: 서버 반영이 성공한 뒤 화면 상태를 갱신합니다.
  updateStatus: async (id, status) => {
    await api.patch<unknown>(`/reports/${encodeURIComponent(id)}/status`, { status })
    set((state) => ({
      reports: state.reports.map((r) => (r.id === id ? { ...r, status } : r)),
    }))
  },

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
