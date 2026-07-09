import { useEffect, useState } from 'react'
import { IconCircleCheck } from '@tabler/icons-react'
import { MileageBalance } from '../components/mileage/MileageBalance'
import { GifticonList } from '../components/mileage/GifticonList'
import { useMileageStore } from '../store/mileageStore'
import { SEED_GIFTICONS } from '../mocks/gifticons'
import type { Gifticon } from '../types'

export default function Mileage() {
  const balance = useMileageStore((s) => s.balance)
  const spend = useMileageStore((s) => s.spend)
  const [toast, setToast] = useState<string | null>(null)

  // 토스트 자동 사라짐
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const handleBuy = (gifticon: Gifticon) => {
    const ok = spend(gifticon.cost)
    if (ok) setToast(`${gifticon.name} 구매 완료! (-${gifticon.cost.toLocaleString()}P)`)
  }

  return (
    <div className="mx-auto h-full w-full max-w-5xl overflow-y-auto px-6 py-8">
      <h1 className="mb-4 text-xl font-bold text-neutral-900">마일리지 / 기프티콘</h1>

      <MileageBalance />

      <h2 className="mb-3 mt-8 text-base font-bold text-neutral-800">
        기프티콘 교환
      </h2>
      <GifticonList gifticons={SEED_GIFTICONS} balance={balance} onBuy={handleBuy} />

      {/* 구매 완료 토스트 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 border border-neutral-800 bg-esg-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          <IconCircleCheck size={18} />
          {toast}
        </div>
      )}
    </div>
  )
}
