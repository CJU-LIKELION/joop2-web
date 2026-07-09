import { useState } from 'react'
import { IconCamera, IconX } from '@tabler/icons-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ReportPhoto } from './ReportPhoto'
import { CLEANUP_REWARD, type Report } from '../../types'

interface CleanupModalProps {
  report: Report | null
  onClose: () => void
  onConfirm: (resolvedPhotoUrl: string) => void
}

// 다른 시민이 신고한 쓰레기를 치우고 "처리 후" 사진을 올려 완료 처리
export function CleanupModal({ report, onClose, onConfirm }: CleanupModalProps) {
  const [photo, setPhoto] = useState('')

  const handleClose = () => {
    setPhoto('')
    onClose()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(String(reader.result))
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleConfirm = () => {
    if (!photo) return
    onConfirm(photo)
    setPhoto('')
  }

  return (
    <Modal
      open={report !== null}
      onClose={handleClose}
      title="치우기 완료 처리"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={!photo}>
            처리 완료 (+{CLEANUP_REWARD}P)
          </Button>
        </div>
      }
    >
      {report && (
        <div className="flex flex-col gap-4">
          {/* 신고 원본 */}
          <div>
            <div className="mb-1 text-xs font-semibold text-neutral-500">
              신고된 내용
            </div>
            <ReportPhoto
              report={report}
              className="h-36 w-full border border-neutral-300"
            />
            <p className="mt-1 text-sm font-bold text-neutral-900">{report.title}</p>
          </div>

          {/* 처리 후 사진 업로드 */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-700">
              치운 후 사진
            </span>
            {photo ? (
              <div className="relative">
                <img
                  src={photo}
                  alt="처리 후 사진 미리보기"
                  className="h-40 w-full border border-neutral-300 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhoto('')}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center border border-neutral-800 bg-white text-neutral-700 hover:text-red-600"
                  aria-label="사진 삭제"
                >
                  <IconX size={16} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-neutral-300 py-6 text-sm text-neutral-500 transition-colors hover:border-esg-600 hover:text-esg-700">
                <IconCamera size={18} />
                치운 후 사진 첨부
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}
