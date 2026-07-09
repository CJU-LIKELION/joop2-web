import { GifticonCard } from './GifticonCard'
import type { Gifticon } from '../../types'

interface GifticonListProps {
  gifticons: Gifticon[]
  balance: number
  onBuy: (gifticon: Gifticon) => void
}

export function GifticonList({ gifticons, balance, onBuy }: GifticonListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {gifticons.map((g) => (
        <GifticonCard key={g.id} gifticon={g} balance={balance} onBuy={onBuy} />
      ))}
    </div>
  )
}
