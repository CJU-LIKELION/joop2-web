/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // 각진(뾰족한) 테두리 강제 — 모든 border-radius 토큰을 0으로 override
    borderRadius: {
      none: '0',
      sm: '0',
      DEFAULT: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
    },
    extend: {
      colors: {
        // ESG 그린 계열 accent
        esg: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // 신고 상태별 색상
        status: {
          received: '#f59e0b',
          progress: '#3b82f6',
          done: '#16a34a',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          'system-ui',
          '-apple-system',
          'Apple SD Gothic Neo',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
