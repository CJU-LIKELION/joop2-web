// 백엔드 연결용 공용 API 클라이언트.
// - 베이스 URL 은 .env 의 VITE_API_BASE_URL 로 주입 (미설정 시 '/api')
// - 구체 엔드포인트는 백엔드와 합의 후 각 store 의 TODO(API) 지점에서 호출

const DEFAULT_API_BASE_URL = '/api'
const DEFAULT_API_HEALTH_PATH = '/health'

function normalizeBaseUrl(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed.replace(/\/+$/, '') : DEFAULT_API_BASE_URL
}

function normalizePath(value?: string) {
  const trimmed = value?.trim()
  if (!trimmed) return DEFAULT_API_HEALTH_PATH
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)
export const API_HEALTH_PATH = normalizePath(import.meta.env.VITE_API_HEALTH_PATH)

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${normalizePath(path)}`
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} (${path})`)
  }
  // 204 No Content 대응
  return (res.status === 204 ? undefined : await res.json()) as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
