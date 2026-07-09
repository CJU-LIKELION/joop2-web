import { IconGift } from '@tabler/icons-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import type { Gifticon } from '../../types'

interface GifticonCardProps {
  gifticon: Gifticon
  balance: number
  onBuy: (gifticon: Gifticon) => void
}

export function GifticonCard({ gifticon, balance, onBuy }: GifticonCardProps) {
  const affordable = balance >= gifticon.cost

  return (
    <Card className="flex flex-col">
      {/* 썸네일 (이미지 없으면 아이콘 placeholder) */}
      <div className="flex h-28 items-center justify-center border-b border-neutral-200 bg-neutral-100">
        {gifticon.imageUrl ? (
          <img
            src={gifticon.imageUrl}
            alt={gifticon.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <IconGift size={40} className="text-neutral-400" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs text-neutral-500">{gifticon.brand}</span>
        <span className="text-sm font-bold text-neutral-900">{gifticon.name}</span>
        <span className="mt-1 text-lg font-bold text-esg-700">
          {gifticon.cost.toLocaleString()}P
        </span>
      </div>

      <div className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={!affordable}
          onClick={() => onBuy(gifticon)}
        >
          {affordable ? '구매하기' : '마일리지 부족'}
        </Button>
      </div>
    </Card>
  )
}
