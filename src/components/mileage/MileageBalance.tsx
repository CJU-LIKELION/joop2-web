import { IconCoin } from '@tabler/icons-react'
import { useMileageStore } from '../../store/mileageStore'

export function MileageBalance() {
  const balance = useMileageStore((s) => s.balance)

  return (
    <div className="flex items-center justify-between border border-neutral-800 bg-esg-600 px-6 py-5 text-white">
      <div className="flex items-center gap-3">
        <IconCoin size={28} />
        <span className="text-sm font-medium">보유 마일리지</span>
      </div>
      <span className="text-3xl font-bold tabular-nums">
        {balance.toLocaleString()}
        <span className="ml-1 text-lg font-medium">P</span>
      </span>
    </div>
  )
}
