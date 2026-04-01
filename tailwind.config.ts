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
        // Primary — purple palette matching Codepet pixel logo
        primary:        '#7B6DC8',
        'primary-dark': '#2D2466',
        'primary-tint': '#EDEAF7',
        // Secondary
        info:           '#7C9DF5',
        'info-dark':    '#4B6CD4',
        'info-tint':    '#EEF2FF',
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
        surface:        '#F8F7FC',
        border:         '#E5E2F0',
        text:           '#4B4B4B',
        heading:        '#1A1A2E',
        muted:          '#777777',
        'muted-light':  '#AFAFAF',
        // Mood states
        'mood-flow':      '#7B6DC8',
        'mood-stuck':     '#FB7185',
        'mood-milestone': '#A78BFA',
        'mood-thinking':  '#7C9DF5',
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
        'btn':     '0 2px 8px rgba(124,108,196,0.35)',
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
