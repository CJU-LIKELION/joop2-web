import type { ReactNode } from 'react'
import { IconX } from '@tabler/icons-react'
import { cn } from '../../lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

// 각진 테두리 모달
export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 백드롭 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 본문 */}
      <div
        className={cn(
          'relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col border border-neutral-800 bg-white',
          className,
        )}
      >
        <header className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h2 className="text-base font-bold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900"
            aria-label="닫기"
          >
            <IconX size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {footer && (
          <footer className="border-t border-neutral-200 px-4 py-3">{footer}</footer>
        )}
      </div>
    </div>
  )
}
