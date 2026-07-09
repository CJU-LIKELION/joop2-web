import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type CardProps = HTMLAttributes<HTMLDivElement>

// 각진 테두리 카드 (border-radius 0은 tailwind config에서 전역 처리)
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn('border border-neutral-300 bg-white', className)}
      {...props}
    >
      {children}
    </div>
  )
}
