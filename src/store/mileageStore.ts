import { create } from 'zustand'

interface MileageState {
  balance: number
  earn: (amount: number) => void
  // 차감 성공 시 true, 잔액 부족 시 false
  spend: (amount: number) => boolean
}

// 데모 시작 잔액
const INITIAL_BALANCE = 1200

export const useMileageStore = create<MileageState>((set, get) => ({
  balance: INITIAL_BALANCE,
  earn: (amount) => set((state) => ({ balance: state.balance + amount })),
  spend: (amount) => {
    if (get().balance < amount) return false
    set((state) => ({ balance: state.balance - amount }))
    return true
  },
}))
