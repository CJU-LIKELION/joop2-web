import { API_HEALTH_PATH, buildApiUrl } from './api'

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

async function readResponseBody(res: Response) {
  if (res.status === 204) return null

  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return res.json().catch(() => null)
  }

  return res.text().catch(() => '')
}

export async function checkBackendConnection() {
  const url = buildApiUrl(API_HEALTH_PATH)

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json, text/plain, */*' },
      cache: 'no-store',
    })
    const contentType = res.headers.get('content-type') ?? ''
    const body = await readResponseBody(res)

    if (contentType.includes('text/html')) {
      throw new Error('백엔드 대신 HTML 문서가 응답했습니다. API base URL 또는 proxy 설정을 확인하세요.')
    }

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`)
    }

    console.log('백엔드 연결 성공', { url, status: res.status, body })
  } catch (error) {
    console.log('백엔드 연결 실패', { url, error: toErrorMessage(error) })
  }
}
