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
        surface:        '#F7F7F7',
        border:         '#E5E5E5',
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
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        pill: '9999px',
      },
      boxShadow: {
        'card':    '0 4px 0 #E5E5E5',
        'card-lg': '0 8px 0 #E5E5E5',
        'btn':     '0 5px 0 #059669',
        'btn-info':'0 5px 0 #0284C7',
        'btn-ghost':'0 5px 0 #E5E5E5',
      },
      fontFamily: {
        sans: ['"Varela Round"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
