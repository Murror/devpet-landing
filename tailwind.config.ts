import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mint:        '#34D399',
        'mint-light':'#ECFDF5',
        'mint-dark': '#059669',
        'warm-bg':   '#FAFFFE',
        'card-bg':   '#FFFFFF',
        border:      '#D1FAE5',
        text:        '#1A2E23',
        muted:       '#6B8F7B',
        'muted-light':'#A7C4B4',
        'yellow-bg': '#FFF8EE',
        yellow:      '#D89840',
        'purple-bg': '#F0EEFF',
        purple:      '#8C39AA',
        'mood-flow':      '#34D399',
        'mood-stuck':     '#F5A623',
        'mood-milestone': '#A855F7',
        'mood-thinking':  '#6B8F7B',
      },
      borderRadius: {
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        pill: '9999px',
      },
      boxShadow: {
        card:  '0 2px 12px rgba(26,46,35,0.06)',
        app:   '0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.03)',
        hover: '0 4px 20px rgba(26,46,35,0.10)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
