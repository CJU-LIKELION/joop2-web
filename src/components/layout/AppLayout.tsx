import { Link, useLocation, useNavigate } from 'react-router-dom'
import { IconLeaf, IconUser, IconBuildingCommunity, IconGift } from '@tabler/icons-react'
import { useRoleStore, type Role } from '../../store/roleStore'
import { useMileageStore } from '../../store/mileageStore'
import { cn } from '../../lib/cn'
import type { ReactNode } from 'react'

// 역할 토글 → 해당 역할의 기본 라우트로 이동
const ROLE_ROUTE: Record<Role, string> = {
  citizen: '/',
  dept: '/dashboard',
}

function RoleToggle() {
  const role = useRoleStore((s) => s.role)
  const setRole = useRoleStore((s) => s.setRole)
  const navigate = useNavigate()

  const select = (next: Role) => {
    setRole(next)
    navigate(ROLE_ROUTE[next])
  }

  return (
    <div className="flex border border-neutral-300">
      <button
        onClick={() => select('citizen')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors',
          role === 'citizen'
            ? 'bg-esg-600 text-white'
            : 'bg-white text-neutral-600 hover:bg-neutral-100',
        )}
      >
        <IconUser size={16} />
        시민
      </button>
      <button
        onClick={() => select('dept')}
        className={cn(
          'flex items-center gap-1.5 border-l border-neutral-300 px-3 py-1.5 text-sm font-medium transition-colors',
          role === 'dept'
            ? 'bg-esg-600 text-white'
            : 'bg-white text-neutral-600 hover:bg-neutral-100',
        )}
      >
        <IconBuildingCommunity size={16} />
        담당부서
      </button>
    </div>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const balance = useMileageStore((s) => s.balance)
  const location = useLocation()
  const onMileage = location.pathname === '/mileage'

  return (
    <div className="flex h-full flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-white px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center bg-esg-600 text-white">
            <IconLeaf size={20} />
          </span>
          <span className="text-lg font-bold text-neutral-900">지역사회 ESG</span>
        </Link>

        <div className="flex items-center gap-3">
          <RoleToggle />
          <Link
            to="/mileage"
            className={cn(
              'flex items-center gap-1.5 border px-3 py-1.5 text-sm font-medium transition-colors',
              onMileage
                ? 'border-esg-600 bg-esg-50 text-esg-700'
                : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400',
            )}
          >
            <IconGift size={16} />
            {balance.toLocaleString()}P
          </Link>
        </div>
      </header>

      <main className="min-h-0 flex-1">{children}</main>
    </div>
  )
}
