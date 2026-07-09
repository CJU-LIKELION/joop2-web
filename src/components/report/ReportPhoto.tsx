import { useState } from 'react'
import { IconTrash } from '@tabler/icons-react'
import { reportPhotoUrl, reportPhotoFallbackUrl } from '../../lib/reportPhoto'
import type { Report } from '../../types'
import { cn } from '../../lib/cn'

// 쓰레기 사진: loremflickr → picsum → 아이콘 placeholder 순으로 폴백
export function ReportPhoto({
  report,
  className,
}: {
  report: Report
  className?: string
}) {
  const [step, setStep] = useState(0)
  const urls = [reportPhotoUrl(report), reportPhotoFallbackUrl(report)]

  if (step >= urls.length) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-neutral-100 text-neutral-400',
          className,
        )}
      >
        <IconTrash size={32} />
      </div>
    )
  }

  return (
    <img
      src={urls[step]}
      alt={report.title}
      loading="lazy"
      onError={() => setStep((s) => s + 1)}
      className={cn('object-cover', className)}
    />
  )
}
