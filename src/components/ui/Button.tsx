import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}

const VARIANT: Record<Variant, string> = {
  primary:
    'bg-esg-600 text-white border border-esg-600 hover:bg-esg-700 hover:border-esg-700 disabled:bg-neutral-300 disabled:border-neutral-300',
  outline:
    'bg-white text-neutral-800 border border-neutral-300 hover:border-esg-600 hover:text-esg-700',
  ghost: 'bg-transparent text-neutral-700 border border-transparent hover:bg-neutral-100',
  danger: 'bg-white text-red-600 border border-red-300 hover:bg-red-50',
}

const SIZE: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-60',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
