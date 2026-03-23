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
        mint:        '#49DCB1',
        'mint-light':'#E8F9F4',
        'mint-dark': '#3DB794',
        'warm-bg':   '#FAF8F4',
        'card-bg':   '#FFFFFF',
        border:      '#EEE9E0',
        text:        '#2D2A26',
        muted:       '#A09B8E',
        'muted-light':'#C8C0B4',
        'yellow-bg': '#FFF8EE',
        yellow:      '#D89840',
        'purple-bg': '#F0EEFF',
        purple:      '#8C39AA',
        'mood-flow':      '#49DCB1',
        'mood-stuck':     '#F5A623',
        'mood-milestone': '#A855F7',
        'mood-thinking':  '#A09B8E',
      },
      borderRadius: {
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        pill: '9999px',
      },
      boxShadow: {
        card:  '0 2px 12px rgba(45,42,38,0.07)',
        app:   '0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        hover: '0 4px 20px rgba(45,42,38,0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
