import { useEffect, useState } from 'react'
import { IconMapPin, IconEdit, IconCamera, IconX } from '@tabler/icons-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { REPORT_REWARD } from '../../types'
import type { NewReportInput } from '../../store/reportsStore'
import { reverseGeocode } from '../../lib/reverseGeocode'
import {
  ALLOWED_REPORT_IMAGE_TYPES,
  MAX_REPORT_ADDRESS_LENGTH,
  MAX_REPORT_CONTENT_LENGTH,
  MAX_REPORT_TITLE_LENGTH,
  buildCreateReportRequest,
  validateReportImageFile,
} from '../../lib/reportValidation'

interface ReportFormProps {
  open: boolean
  coord: { lat: number; lng: number } | null
  onClose: () => void
  onSubmit: (input: NewReportInput) => void
  // 위치 재선택 (모달을 닫고 지도에서 다시 찍기 — 입력값은 유지)
  onRepick: () => void
}

export function ReportForm({ open, coord, onClose, onSubmit, onRepick }: ReportFormProps) {
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [addressLoading, setAddressLoading] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState('') // 업로드한 사진 data URL
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !coord) return

    let canceled = false
    setAddress('')
    setAddressLoading(true)
    setAddressError(null)

    reverseGeocode(coord)
      .then((result) => {
        if (!canceled) setAddress(result)
      })
      .catch((error: unknown) => {
        if (canceled) return
        const message = error instanceof Error ? error.message : '주소 자동 입력에 실패했습니다.'
        setAddressError(message)
      })
      .finally(() => {
        if (!canceled) setAddressLoading(false)
      })

    return () => {
      canceled = true
    }
  }, [open, coord])

  const reset = () => {
    setTitle('')
    setAddress('')
    setAddressLoading(false)
    setAddressError(null)
    setDescription('')
    setPhoto('')
    setPhotoError(null)
    setSubmitError(null)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // 같은 파일 재선택 허용
    if (!file) return

    setPhotoError(null)
    setSubmitError(null)
    try {
      await validateReportImageFile(file)
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('사진을 읽지 못했습니다.'))
        reader.readAsDataURL(file)
      })
      setPhoto(dataUrl)
    } catch (error) {
      setPhoto('')
      setPhotoError(error instanceof Error ? error.message : '사진 첨부에 실패했습니다.')
    }
  }

  const canSubmit =
    title.trim().length > 0 &&
    address.trim().length > 0 &&
    description.trim().length > 0 &&
    coord !== null &&
    photo !== ''

  const handleSubmit = () => {
    if (!canSubmit || !coord) return

    const input: NewReportInput = {
      title: title.trim(),
      address: address.trim(),
      description: description.trim(),
      category: 'litter', // 단일 카테고리 (쓰레기 무단투기)
      lat: coord.lat,
      lng: coord.lng,
      photoUrl: photo,
    }

    try {
      buildCreateReportRequest(input)
      onSubmit(input)
      reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '입력값을 확인해주세요.')
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="신고하기"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            신고 접수 (+{REPORT_REWARD}P)
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* 위치 — 클릭 시 지도에서 재선택 */}
        <button
          type="button"
          onClick={onRepick}
          className="flex items-center justify-between gap-2 border border-neutral-300 bg-neutral-50 px-3 py-2 text-left text-sm transition-colors hover:border-esg-600 hover:bg-esg-50"
        >
          <span className="flex items-center gap-2">
            <IconMapPin size={18} className="text-esg-600" />
            {coord ? (
              <span className="text-neutral-700">
                위치: {coord.lat.toFixed(5)}, {coord.lng.toFixed(5)}
              </span>
            ) : (
              <span className="text-neutral-400">지도를 클릭해 위치를 지정하세요</span>
            )}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-esg-700">
            <IconEdit size={14} />
            위치 재선택
          </span>
        </button>

        {/* 주소 */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-neutral-700">주소</span>
          <input
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
              setAddressError(null)
              setSubmitError(null)
            }}
            maxLength={MAX_REPORT_ADDRESS_LENGTH}
            placeholder={
              addressLoading ? '선택한 위치의 주소를 찾는 중…' : '예: 충북 청주시 상당구 성안로 1'
            }
            className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-esg-600"
          />
          {addressError && (
            <span className="text-xs text-red-600">{addressError} 직접 입력해주세요.</span>
          )}
        </label>

        {/* 제목 */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-neutral-700">제목</span>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setSubmitError(null)
            }}
            maxLength={MAX_REPORT_TITLE_LENGTH}
            placeholder="예: 성안길 입구 쓰레기 더미"
            className="border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-esg-600"
          />
        </label>

        {/* 설명 */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-neutral-700">설명 (필수)</span>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              setSubmitError(null)
            }}
            maxLength={MAX_REPORT_CONTENT_LENGTH}
            rows={3}
            placeholder="상황을 설명해주세요."
            className="resize-none border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-esg-600"
          />
        </label>

        {/* 사진 업로드 */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-neutral-700">사진 (필수)</span>
          {photo ? (
            <div className="relative">
              <img
                src={photo}
                alt="첨부 사진 미리보기"
                className="h-40 w-full border border-neutral-300 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPhoto('')
                  setPhotoError(null)
                  setSubmitError(null)
                }}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center border border-neutral-800 bg-white text-neutral-700 hover:text-red-600"
                aria-label="사진 삭제"
              >
                <IconX size={16} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-neutral-300 py-6 text-sm text-neutral-500 transition-colors hover:border-esg-600 hover:text-esg-700">
              <IconCamera size={18} />
              사진 첨부
              <input
                type="file"
                accept={ALLOWED_REPORT_IMAGE_TYPES.join(',')}
                onChange={handleFile}
                className="hidden"
              />
            </label>
          )}
          {photoError && <span className="text-xs text-red-600">{photoError}</span>}
        </div>

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      </div>
    </Modal>
  )
}
