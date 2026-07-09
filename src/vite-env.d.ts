/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_MAP_KEY: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_HEALTH_PATH: string
  readonly VITE_API_PROXY_TARGET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Kakao Maps SDK 전역 타입 (필요 최소한만 선언)
interface Window {
  kakao: any
}
