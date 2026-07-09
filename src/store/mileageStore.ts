import { create } from 'zustand'

/*
 * [백엔드 연동 지점 — 마일리지]
 * 현재는 고정 시작잔액 + 메모리 계산으로 동작.
 * 실제 엔드포인트는 미합의 → api 클라이언트(src/lib/api.ts)로 교체 예정.
 * (잔액 조회 / 적립 / 사용)
 */

interface MileageState {
  balance: number
  earn: (amount: number) => void
  // 차감 성공 시 true, 잔액 부족 시 false
  spend: (amount: number) => boolean
}

// TODO(API): 잔액 조회로 초기화 (지금은 고정값)
const INITIAL_BALANCE = 1200

export const useMileageStore = create<MileageState>((set, get) => ({
  balance: INITIAL_BALANCE,
  // TODO(API): 서버 적립 결과(응답 잔액)로 반영
  earn: (amount) => set((state) => ({ balance: state.balance + amount })),
  // TODO(API): 기프티콘 구매 요청 → 성공 시 응답 잔액 반영
  spend: (amount) => {
    if (get().balance < amount) return false
    set((state) => ({ balance: state.balance - amount }))
    return true
  },
}))
