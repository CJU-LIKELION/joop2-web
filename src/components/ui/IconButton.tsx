import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  active?: boolean
}

// 각진 아이콘 버튼
export function IconButton({ icon, active, className, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center border transition-colors',
        active
          ? 'border-esg-600 bg-esg-50 text-esg-700'
          : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400',
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  )
}
