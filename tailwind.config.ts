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
        // Primary
        primary:        '#34D399',
        'primary-dark': '#059669',
        'primary-tint': '#ECFDF5',
        // Secondary
        info:           '#38BDF8',
        'info-dark':    '#0284C7',
        'info-tint':    '#EFF6FF',
        danger:         '#FB7185',
        'danger-dark':  '#E11D48',
        xp:             '#FBBF24',
        'xp-dark':      '#D97706',
        'xp-tint':      '#FFFBEB',
        premium:        '#A78BFA',
        'premium-dark': '#7C3AED',
        'premium-tint': '#FDF4FF',
        streak:         '#FB923C',
        'streak-dark':  '#EA580C',
        // Neutrals
        bg:             '#FFFFFF',
        surface:        '#FAFAF9',
        border:         '#EBEBEB',
        text:           '#4B4B4B',
        heading:        '#1A1A1A',
        muted:          '#777777',
        'muted-light':  '#AFAFAF',
        // Mood states
        'mood-flow':      '#34D399',
        'mood-stuck':     '#FB7185',
        'mood-milestone': '#A78BFA',
        'mood-thinking':  '#38BDF8',
      },
      borderRadius: {
        sm:   '10px',
        md:   '14px',
        lg:   '20px',
        xl:   '28px',
        pill: '9999px',
      },
      boxShadow: {
        'card':    '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-lg': '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.04)',
        'btn':     '0 2px 8px rgba(5,150,105,0.35)',
        'btn-info':'0 2px 8px rgba(2,132,199,0.35)',
        'btn-ghost':'0 2px 8px rgba(0,0,0,0.06)',
        'soft':    '0 1px 3px rgba(0,0,0,0.04)',
      },
      fontFamily: {
        sans: ['"Varela Round"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
