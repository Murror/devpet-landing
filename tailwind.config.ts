import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'warm-bg': '#FFFBF5',
        'text': '#1A1A2E',
        'muted': '#6B7280',
      },
    },
  },
  plugins: [],
}

export default config
