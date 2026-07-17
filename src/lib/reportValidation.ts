import type { ReportCategory } from '../types'

export const MAX_REPORT_TITLE_LENGTH = 100
export const MAX_REPORT_ADDRESS_LENGTH = 200
export const MAX_REPORT_CONTENT_LENGTH = 2000
export const MAX_REPORT_IMAGE_BYTES = 5 * 1024 * 1024
export const ALLOWED_REPORT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

interface ReportSubmissionInput {
  title: string
  category: string
  description: string
  address: string
  lat: number
  lng: number
  photoUrl: string
}

export interface CreateReportRequest {
  title: string
  category: ReportCategory
  content: string
  address: string
  latitude: number
  longitude: number
  imageUrl: string
}

const REPORT_CATEGORIES: ReportCategory[] = ['litter', 'damage', 'recycling', 'other']
const IMAGE_DATA_URL_PREFIX = /^data:image\/(jpeg|png|webp);base64,/

function hasUnsafeControlCharacters(value: string) {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0)
    return code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127
  })
}

function normalizeSingleLine(value: string, label: string, maxLength: number) {
  if (typeof value !== 'string' || hasUnsafeControlCharacters(value)) {
    throw new Error(`${label}에 허용되지 않은 문자가 포함되어 있습니다.`)
  }

  const normalized = value.trim().replace(/\s+/g, ' ')
  if (!normalized) throw new Error(`${label}을(를) 입력해주세요.`)
  if (normalized.length > maxLength) {
    throw new Error(`${label}은(는) ${maxLength}자 이하로 입력해주세요.`)
  }
  return normalized
}

function normalizeContent(value: string) {
  if (typeof value !== 'string' || hasUnsafeControlCharacters(value)) {
    throw new Error('설명에 허용되지 않은 문자가 포함되어 있습니다.')
  }

  const normalized = value.trim()
  if (!normalized) throw new Error('설명을 입력해주세요.')
  if (normalized.length > MAX_REPORT_CONTENT_LENGTH) {
    throw new Error(`설명은 ${MAX_REPORT_CONTENT_LENGTH}자 이하로 입력해주세요.`)
  }
  return normalized
}

function validateCoordinate(value: number, min: number, max: number, label: string) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label} 값이 올바르지 않습니다.`)
  }
  return value
}

function validateImageUrl(value: string) {
  if (typeof value !== 'string' || !value) throw new Error('사진을 첨부해주세요.')

  const dataUrlMatch = value.match(IMAGE_DATA_URL_PREFIX)
  if (dataUrlMatch) {
    const encoded = value.slice(dataUrlMatch[0].length)
    if (!encoded || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) {
      throw new Error('사진 데이터 형식이 올바르지 않습니다.')
    }
    const paddingLength = encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0
    const estimatedBytes = Math.floor((encoded.length * 3) / 4) - paddingLength
    if (estimatedBytes > MAX_REPORT_IMAGE_BYTES) {
      throw new Error('사진은 5MB 이하만 첨부할 수 있습니다.')
    }

    try {
      const binaryHeader = atob(encoded.slice(0, 32))
      const header = Uint8Array.from(binaryHeader, (character) => character.charCodeAt(0))
      if (!hasExpectedSignature(`image/${dataUrlMatch[1]}`, header)) throw new Error()
    } catch {
      throw new Error('사진 데이터와 이미지 형식이 일치하지 않습니다.')
    }
    return value
  }

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') throw new Error()
    return url.toString()
  } catch {
    throw new Error('사진 URL은 HTTPS 주소만 사용할 수 있습니다.')
  }
}

function hasExpectedSignature(type: string, bytes: Uint8Array) {
  if (type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (type === 'image/png') {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    return png.every((value, index) => bytes[index] === value)
  }
  if (type === 'image/webp') {
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
      String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
    )
  }
  return false
}

export async function validateReportImageFile(file: File) {
  if (!ALLOWED_REPORT_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_REPORT_IMAGE_TYPES)[number])) {
    throw new Error('JPG, PNG, WebP 이미지만 첨부할 수 있습니다.')
  }
  if (file.size <= 0 || file.size > MAX_REPORT_IMAGE_BYTES) {
    throw new Error('사진은 5MB 이하만 첨부할 수 있습니다.')
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  if (!hasExpectedSignature(file.type, header)) {
    throw new Error('파일 내용과 이미지 형식이 일치하지 않습니다.')
  }
}

export function buildCreateReportRequest(input: ReportSubmissionInput): CreateReportRequest {
  if (!REPORT_CATEGORIES.includes(input.category as ReportCategory)) {
    throw new Error('신고 카테고리가 올바르지 않습니다.')
  }

  return {
    title: normalizeSingleLine(input.title, '제목', MAX_REPORT_TITLE_LENGTH),
    category: input.category as ReportCategory,
    content: normalizeContent(input.description),
    address: normalizeSingleLine(input.address, '주소', MAX_REPORT_ADDRESS_LENGTH),
    latitude: validateCoordinate(input.lat, -90, 90, '위도'),
    longitude: validateCoordinate(input.lng, -180, 180, '경도'),
    imageUrl: validateImageUrl(input.photoUrl),
  }
}
