import { create } from 'zustand'

// 시민 / 담당부서 역할
export type Role = 'citizen' | 'dept'

interface RoleState {
  role: Role
  setRole: (role: Role) => void
}

export const useRoleStore = create<RoleState>((set) => ({
  role: 'citizen',
  setRole: (role) => set({ role }),
}))
