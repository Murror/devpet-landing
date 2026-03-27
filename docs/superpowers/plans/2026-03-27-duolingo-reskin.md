# Duolingo-Style Visual Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the entire DevPet landing page with Duolingo's design language — 3D buttons, bold saturated colors, Varela Round typography, bouncy animations — while keeping all content and characters intact.

**Architecture:** Systematic layer-by-layer approach: design tokens first (Tailwind config, font, global CSS), then shared components (ScrollReveal, SectionHeader, WaitlistForm), then each section component top-to-bottom.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 3, Framer Motion 12, Varela Round (Google Font)

---

### Task 1: Update Tailwind Design Tokens

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace the color palette, shadows, border-radius, and font family**

Replace the entire content of `tailwind.config.ts` with:

```typescript
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
```

- [ ] **Step 2: Verify the config is valid**

Run: `npx tailwindcss --help > /dev/null 2>&1 && echo "OK"`
Expected: OK (no syntax errors)

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "style: replace Tailwind design tokens with Duolingo-inspired palette"
```

---

### Task 2: Update Font and Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace Inter with Varela Round**

Replace the entire content of `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { Varela_Round } from 'next/font/google'
import { LocaleProvider } from '@/lib/LocaleProvider'
import { CompanionProvider } from '@/lib/CompanionContext'
import './globals.css'

const varelaRound = Varela_Round({ weight: '400', subsets: ['latin'], variable: '--font-varela' })

export const metadata: Metadata = {
  title: 'VibeMon — Theo dõi và nâng cao kỹ năng lập trình AI',
  description: 'Bạn đồng hành AI giúp theo dõi phiên lập trình, phát triển kỹ năng, và biến sai lầm thành bài học.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className={varelaRound.variable}>
        <LocaleProvider>
          <CompanionProvider>
            {children}
          </CompanionProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "style: replace Inter with Varela Round font"
```

---

### Task 3: Update Global CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace base styles, button active state, and remove meet-gradient**

Replace lines 1-28 of `app/globals.css` (everything before the `/* Respect reduced motion */` comment) with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg text-text font-sans antialiased;
  }
}

/* Duolingo 3D button press — replaces Emil Kowalski scale approach */
button:active, a[href]:active {
  /* Let Framer Motion or component-level styles handle press states */
}

/* Gate hover behind pointer:fine to avoid false positives on touch */
@media (hover: none) {
  .transition-colors:hover {
    transition: none;
  }
}
```

This removes:
- `bg-warm-bg` → `bg-bg` (white)
- The `.bg-meet-gradient` utility (no longer needed)
- The `scale(0.97)` button active state (replaced by 3D push-down in components)

- [ ] **Step 2: Verify globals.css is valid**

Run: `head -30 app/globals.css`
Expected: The new base styles without meet-gradient or scale active state.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: update global CSS for Duolingo theme — white bg, remove old active states"
```

---

### Task 4: Update ScrollReveal with Spring Physics

**Files:**
- Modify: `components/ScrollReveal.tsx`

- [ ] **Step 1: Replace ease curve with spring physics**

Replace the entire content of `components/ScrollReveal.tsx` with:

```tsx
'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function ScrollReveal({ children, delay = 0, className = '' }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: delay / 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ScrollReveal.tsx
git commit -m "style: replace ScrollReveal ease with spring physics"
```

---

### Task 5: Update SectionHeader

**Files:**
- Modify: `components/SectionHeader.tsx`

- [ ] **Step 1: Update typography classes for Duolingo style**

Replace the entire content of `components/SectionHeader.tsx` with:

```tsx
interface SectionHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-14">
      <p className="text-[13px] text-primary uppercase tracking-[2px] mb-3">{eyebrow}</p>
      <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] text-heading mb-3">{title}</h2>
      {subtitle && <p className="text-[17px] text-muted leading-relaxed max-w-[480px]">{subtitle}</p>}
    </div>
  )
}
```

Changes: `font-bold text-mint` → `text-primary`, `font-black` → removed (Varela Round is 400 only), `text-xs` → `text-[13px]`, add `text-heading`.

- [ ] **Step 2: Commit**

```bash
git add components/SectionHeader.tsx
git commit -m "style: update SectionHeader for Duolingo typography"
```

---

### Task 6: Update WaitlistForm with 3D Buttons and Inputs

**Files:**
- Modify: `components/WaitlistForm.tsx`

- [ ] **Step 1: Replace button and input styles with Duolingo 3D pattern**

Replace the entire content of `components/WaitlistForm.tsx` with:

```tsx
'use client'

import { useState, FormEvent } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { motion, AnimatePresence } from 'framer-motion'

type FormState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

export default function WaitlistForm() {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [validationError, setValidationError] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setValidationError(false)

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isValidEmail) {
      setValidationError(true)
      return
    }

    // TODO: Connect to a backend API (e.g. Cloudflare Worker, Vercel serverless)
    // For now, show success on static hosting
    setState('success')
  }

  if (state === 'success' || state === 'duplicate') {
    const msg = state === 'success' ? t.form.success : t.form.errorDuplicate
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="bg-primary-tint border-2 border-primary rounded-lg px-4 py-3 text-sm text-primary-dark"
      >
        {msg}
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setValidationError(false) }}
          placeholder={t.form.placeholder}
          disabled={state === 'loading'}
          className={`flex-1 bg-bg border-2 rounded-lg px-4 py-3 text-sm text-text placeholder-muted-light outline-none
            focus:border-info focus:shadow-[0_0_0_3px_rgba(56,189,248,0.15)] transition-[border-color,box-shadow] duration-150
            ${validationError ? 'border-danger' : 'border-border'}`}
        />
        <motion.button
          type="submit"
          disabled={state === 'loading'}
          whileTap={{ y: 5, boxShadow: 'none' }}
          className="bg-primary disabled:opacity-60 text-white text-[15px] uppercase tracking-[1px] px-6 py-3 rounded-lg shadow-btn transition-all duration-100 whitespace-nowrap"
        >
          {state === 'loading' ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : t.form.submit}
        </motion.button>
      </div>
      <AnimatePresence>
        {validationError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 text-xs text-danger"
          >
            {t.form.errorValidation}
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 text-xs text-danger"
          >
            {t.form.errorServer}
          </motion.p>
        )}
      </AnimatePresence>
      {t.form.spotsLeft && (
        <p className="mt-2 text-[11px] text-primary-dark flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          {t.form.spotsLeft}
        </p>
      )}
    </form>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/WaitlistForm.tsx
git commit -m "style: 3D push-down buttons and rounded inputs on WaitlistForm"
```

---

### Task 7: Update Nav

**Files:**
- Modify: `components/Nav.tsx`

- [ ] **Step 1: Replace Nav styling with white bg, grey borders, 3D CTA**

Replace the entire content of `components/Nav.tsx` with:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { Cat } from 'lucide-react'

export default function Nav() {
  const { t } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`sticky top-0 z-50 bg-bg border-b-2 transition-[border-color] duration-200
        ${scrolled ? 'border-border' : 'border-transparent'}`}
    >
      <div className="mx-auto max-w-[1100px] px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center"><Cat className="w-4 h-4 text-white" /></div>
          <span className="text-[17px] text-heading">VibeMon</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-7">
          {([{ label: t.nav.howItWorks, href: '#how-it-works' }, { label: t.nav.features, href: '#features' }, { label: t.meetYourPet.eyebrow, href: '#meet-your-pet' }]).map(link => (
            <a key={link.href} href={link.href} className="text-sm text-muted hover:text-heading transition-colors cursor-pointer">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: CTA + hamburger */}
        <div className="flex items-center gap-3">
          <motion.a
            href="#hero"
            whileTap={{ y: 5, boxShadow: 'none' }}
            className="hidden sm:block bg-primary text-white text-[13px] uppercase tracking-[1px] px-5 py-2 rounded-lg shadow-btn transition-all duration-100"
          >
            {t.nav.joinWaitlist}
          </motion.a>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden text-muted hover:text-heading text-xl transition-transform duration-150"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="md:hidden border-t-2 border-border bg-bg px-6 py-4 flex flex-col gap-4 overflow-hidden"
          >
            {([{ label: t.nav.howItWorks, href: '#how-it-works' }, { label: t.nav.features, href: '#features' }, { label: t.meetYourPet.eyebrow, href: '#meet-your-pet' }]).map(link => (
              <a key={link.href} href={link.href} className="text-sm text-muted" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <motion.a
              href="#hero"
              whileTap={{ y: 5, boxShadow: 'none' }}
              className="bg-primary text-white text-[13px] uppercase tracking-[1px] px-5 py-2.5 rounded-lg shadow-btn text-center"
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.joinWaitlist}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Nav.tsx
git commit -m "style: Duolingo-style Nav — white bg, 3D CTA, grey borders"
```

---

### Task 8: Update Hero

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Update Hero styling**

Replace the entire content of `components/Hero.tsx` with:

```tsx
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { useCompanion } from '@/lib/CompanionContext'
import { motion, useInView } from 'framer-motion'
import WaitlistForm from './WaitlistForm'
import AppWindowMockup from './AppWindowMockup'

// Parse stat value like "1,504" → { num: 1504, prefix: "", suffix: "", format: (n) => "1,504" }
function parseStat(value: string) {
  const match = value.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const prefix = match[1]
  const numStr = match[2].replace(/,/g, '')
  const suffix = match[3]
  const num = parseFloat(numStr)
  const hasComma = match[2].includes(',')
  const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0
  return {
    num,
    prefix,
    suffix,
    format: (n: number) => {
      let s = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString()
      if (hasComma) s = Number(s).toLocaleString('en-US')
      return prefix + s + suffix
    },
  }
}

function CountUp({ value, duration = 1.5, delay = 0, enabled = true }: { value: string; duration?: number; delay?: number; enabled?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value.replace(/[\d]/g, '0'))
  const parsed = parseStat(value)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!enabled || !parsed || hasRun.current) return
    hasRun.current = true

    const delayMs = delay * 1000
    const timeout = setTimeout(() => {
      const start = performance.now()
      const durationMs = duration * 1000

      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / durationMs, 1)
        // easeOut cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(parsed.format(eased * parsed.num))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delayMs)

    return () => clearTimeout(timeout)
  }, [enabled])

  return <span ref={ref}>{parsed ? display : value}</span>
}

const duoSpring = { type: 'spring' as const, stiffness: 300, damping: 20 }

export default function Hero() {
  const { t } = useLocale()
  const { pickerDismissed } = useCompanion()

  const show = pickerDismissed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }

  return (
    <section id="hero" className="mx-auto max-w-[1100px] px-6 py-20 md:py-24 grid md:grid-cols-[1fr_1.1fr] gap-16 items-center">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ ...duoSpring }}
          className="inline-flex items-center gap-1.5 bg-primary-tint border-2 border-primary rounded-pill px-3 py-1.5 text-xs text-primary-dark mb-6 shadow-[0_3px_0_#059669]"
        >
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          {t.hero.badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ ...duoSpring, delay: 0.1 }}
          className="text-[36px] md:text-[48px] leading-[1.1] tracking-[-2px] text-heading mb-5"
        >
          {t.hero.title}{' '}
          <em className="text-primary italic">{t.hero.titleAccent}</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ ...duoSpring, delay: 0.2 }}
          className="text-[17px] text-muted leading-[1.7] max-w-[440px] mb-6"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Inline proof stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ ...duoSpring, delay: 0.3 }}
          className="flex gap-5 mb-6"
        >
          {t.hero.proofStats.map((stat, i) => (
            <div key={i} className="flex flex-col bg-bg border-2 border-border rounded-lg px-3 py-2 shadow-card">
              <span className="text-lg text-heading tabular-nums">
                <CountUp value={stat.value} duration={1.5} delay={0.4 + i * 0.15} enabled={pickerDismissed} />
              </span>
              <span className="text-[10px] text-muted">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ ...duoSpring, delay: 0.4 }}
          className="mb-3"
        >
          <WaitlistForm />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={pickerDismissed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ ...duoSpring, delay: 0.5 }}
          className="text-xs text-muted-light"
        >
          {t.hero.trustMeta}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={show}
        transition={{ ...duoSpring, delay: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        >
          <AppWindowMockup />
        </motion.div>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "style: Duolingo Hero — 3D stat badges, spring animations, updated colors"
```

---

### Task 9: Update WhyVibeCode

**Files:**
- Modify: `components/WhyVibeCode.tsx`

- [ ] **Step 1: Replace WhyVibeCode styling**

Replace the entire content of `components/WhyVibeCode.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'

export default function WhyVibeCode() {
  const { t } = useLocale()
  const data = (t as Record<string, unknown>).whyVibeCode as {
    title: string
    titleAccent: string
    pains: { icon: string; text: string }[]
    cta: string
  }

  if (!data) return null

  return (
    <section className="py-20 md:py-24 bg-surface border-b-2 border-border">
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <ScrollReveal>
          <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] leading-[1.15] text-heading mb-8">
            {data.title}
            <br />
            <em className="text-primary italic">{data.titleAccent}</em>
          </h2>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mb-8">
          {data.pains.map((pain, i) => (
            <ScrollReveal key={i} delay={i * 120}>
              <motion.div
                whileTap={{ y: 4, boxShadow: 'none' }}
                className="flex items-center gap-3 bg-bg border-2 border-border rounded-lg px-5 py-4 shadow-card cursor-pointer transition-all duration-100"
              >
                <div className="relative flex-shrink-0 w-8 h-8">
                  <span
                    className="absolute inset-0 rounded-full bg-danger/15 animate-ping"
                    style={{ animationDuration: '2.5s', animationDelay: `${i * 0.4}s` }}
                  />
                  <span
                    className="relative w-8 h-8 bg-danger/10 rounded-full flex items-center justify-center animate-pulse"
                    style={{ animationDuration: '2.5s', animationDelay: `${i * 0.4}s` }}
                  >
                    <Icon name={pain.icon} className="w-4 h-4 text-danger" />
                  </span>
                </div>
                <p className="text-sm text-text text-left">{pain.text}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <p className="text-[17px] text-muted leading-relaxed">
            {data.cta}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/WhyVibeCode.tsx
git commit -m "style: WhyVibeCode — surface bg, 3D cards, danger accent"
```

---

### Task 10: Update MeetYourPet

**Files:**
- Modify: `components/MeetYourPet.tsx`

- [ ] **Step 1: Replace MeetYourPet styling — remove gradient, add 3D cards**

Replace the entire content of `components/MeetYourPet.tsx` with:

```tsx
'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import CharacterSvg from './CharacterSvg'

/* Confetti particle component */
function Confetti({ color }: { color: string }) {
  const colors = ['#38BDF8', '#FB7185', '#FBBF24', '#A78BFA', '#FB923C', '#34D399']
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * 360
    const rad = (angle * Math.PI) / 180
    const distance = 40 + Math.random() * 30
    return {
      id: i,
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance - 20,
      size: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
      color: colors[i % colors.length],
    }
  })

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
          animate={{
            opacity: 0,
            x: p.x,
            y: p.y,
            scale: 0.2,
            rotate: p.rotation,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute left-1/2 top-1/3"
          style={{
            width: p.size,
            height: p.size,
            borderRadius: p.size > 6 ? '2px' : '50%',
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  )
}

export default function MeetYourPet() {
  const { t } = useLocale()
  const { characters } = t.meetYourPet
  const [activeChar, setActiveChar] = useState<number | null>(null)
  const [confettiChar, setConfettiChar] = useState<number | null>(null)

  const handleClick = (i: number) => {
    setActiveChar(activeChar === i ? null : i)
    setConfettiChar(i)
    setTimeout(() => setConfettiChar(null), 700)
  }

  return (
    <section id="meet-your-pet" className="bg-bg border-b-2 border-border py-20 md:py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <p className="text-[13px] text-primary uppercase tracking-[2px] mb-3">{t.meetYourPet.eyebrow}</p>
            <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] text-heading mb-4">{t.meetYourPet.title}</h2>
            <p className="text-[17px] text-muted leading-[1.7] max-w-[560px] mx-auto">{t.meetYourPet.body}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {characters.map((char, i) => {
            const isActive = activeChar === i
            return (
              <ScrollReveal key={char.name} delay={i * 100}>
                <div className="relative">
                  {/* Speech bubble */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full z-30 w-[200px]"
                      >
                        <div
                          className="rounded-lg border-2 px-3 py-2.5 text-[11px] italic leading-relaxed text-white shadow-card relative"
                          style={{ backgroundColor: char.color, borderColor: char.color }}
                        >
                          &ldquo;{char.quote}&rdquo;
                          <div
                            className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45"
                            style={{ backgroundColor: char.color }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Confetti */}
                  {confettiChar === i && <Confetti color={char.color} />}

                  {/* Card */}
                  <motion.div
                    onClick={() => handleClick(i)}
                    whileTap={{ y: 4, boxShadow: 'none' }}
                    className={`bg-bg rounded-lg border-2 overflow-hidden shadow-card cursor-pointer select-none transition-all duration-100
                      ${isActive ? 'ring-2 ring-offset-2' : ''}`}
                    style={{
                      borderColor: isActive ? char.color : '#E5E5E5',
                      ringColor: isActive ? char.color : undefined,
                    } as React.CSSProperties}
                  >
                    {/* Character SVG */}
                    <div
                      className="w-full aspect-square flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: char.color + '10' }}
                    >
                      <motion.div
                        animate={isActive ? {
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="w-[70%] h-[70%]"
                      >
                        <CharacterSvg name={char.name} className="w-full h-full" />
                      </motion.div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm text-heading">{char.name}</h3>
                        <span
                          className="text-[8px] px-1.5 py-0.5 rounded-pill"
                          style={{ backgroundColor: char.color + '18', color: char.color }}
                        >
                          {char.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted mb-1">{char.species}</p>
                      <p className="text-[10px] text-muted leading-relaxed">{char.role}</p>
                    </div>
                  </motion.div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        <ScrollReveal delay={700}>
          <div className="flex items-center justify-center gap-2 text-sm text-muted mt-10">
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-2 h-2 bg-primary rounded-full flex-shrink-0"
            />
            {t.meetYourPet.growthNote}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/MeetYourPet.tsx
git commit -m "style: MeetYourPet — flat white bg, 3D cards, multi-color confetti"
```

---

### Task 11: Update HowItWorks

**Files:**
- Modify: `components/HowItWorks.tsx`

- [ ] **Step 1: Replace HowItWorks styling**

Replace the entire content of `components/HowItWorks.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'

const stepColors = ['#34D399', '#38BDF8', '#FBBF24']
const stepShadows = ['#059669', '#0284C7', '#D97706']

export default function HowItWorks() {
  const { t } = useLocale()
  const { steps } = t.howItWorks

  return (
    <section id="how-it-works" className="mx-auto max-w-[1100px] px-6 py-20 md:py-24 bg-surface border-b-2 border-border">
      <ScrollReveal>
        <SectionHeader
          eyebrow={t.howItWorks.eyebrow}
          title={t.howItWorks.title}
          subtitle={t.howItWorks.subtitle}
        />
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <ScrollReveal key={step.num} delay={i * 100}>
            <motion.div
              whileTap={{ y: 4, boxShadow: 'none' }}
              className="relative bg-bg border-2 border-border rounded-lg p-7 shadow-card h-full cursor-pointer transition-all duration-100"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm text-white mb-4"
                style={{ backgroundColor: stepColors[i], boxShadow: `0 3px 0 ${stepShadows[i]}` }}
              >
                {step.num}
              </div>
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.15, 1] }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 + i * 0.15 }}
                className="mb-3"
              >
                <Icon name={step.icon} className="w-7 h-7 text-primary" />
              </motion.div>
              <h3 className="text-base text-heading mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.15, ease: 'easeOut' }}
                  className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-bg border-2 border-border rounded-full items-center justify-center text-[11px] text-muted z-10 shadow-[0_2px_0_#E5E5E5]"
                >
                  →
                </motion.div>
              )}
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/HowItWorks.tsx
git commit -m "style: HowItWorks — colored step badges, 3D cards, surface bg"
```

---

### Task 12: Update Features

**Files:**
- Modify: `components/Features.tsx`

- [ ] **Step 1: Replace Features styling**

Replace the entire content of `components/Features.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'

const iconBgClasses = ['bg-primary-tint', 'bg-xp-tint', 'bg-premium-tint', 'bg-info-tint']
const iconTextClasses = ['text-primary-dark', 'text-xp-dark', 'text-premium-dark', 'text-info-dark']

export default function Features() {
  const { t } = useLocale()

  return (
    <section id="features" className="mx-auto max-w-[1100px] px-6 py-20 md:py-24 border-b-2 border-border">
      <ScrollReveal>
        <SectionHeader
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          subtitle={t.features.subtitle}
        />
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {t.features.cards.map((card, i) => (
          <ScrollReveal key={card.title} delay={i * 100}>
            <motion.div
              whileTap={{ y: 4, boxShadow: 'none' }}
              className="bg-bg border-2 border-border rounded-lg p-7 shadow-card h-full cursor-pointer transition-all duration-100"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.12, 1] }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 + i * 0.1 }}
                className={`w-12 h-12 ${iconBgClasses[i]} rounded-md flex items-center justify-center mb-4`}
              >
                <Icon name={card.icon} className={`w-6 h-6 ${iconTextClasses[i]}`} />
              </motion.div>
              <h3 className="text-base text-heading mb-2">{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">{card.desc}</p>
              <ul className="flex flex-col gap-1.5">
                {card.bullets.map((b, bi) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + bi * 0.08, ease: 'easeOut' }}
                    className="flex gap-2 items-start text-sm text-muted"
                  >
                    <span className="text-[10px] text-primary mt-1 flex-shrink-0">✦</span>
                    {b}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Features.tsx
git commit -m "style: Features — 3D cards, Duolingo tint icon backgrounds"
```

---

### Task 13: Update MidCTA

**Files:**
- Modify: `components/MidCTA.tsx`

- [ ] **Step 1: Replace MidCTA with green background section**

Replace the entire content of `components/MidCTA.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import WaitlistForm from './WaitlistForm'

export default function MidCTA() {
  const { t } = useLocale()

  return (
    <section className="py-16 bg-primary">
      <ScrollReveal>
        <div className="mx-auto max-w-[560px] px-6 text-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[28px] md:text-[32px] tracking-[-1px] text-white mb-2"
          >
            {t.midCTA.title}
          </motion.p>
          <p className="text-sm text-white/80 mb-6">{t.midCTA.subtitle}</p>
          <WaitlistForm />
        </div>
      </ScrollReveal>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/MidCTA.tsx
git commit -m "style: MidCTA — primary green background, white text"
```

---

### Task 14: Update SkillTreePreview

**Files:**
- Modify: `components/SkillTreePreview.tsx`

- [ ] **Step 1: Replace SkillTreePreview styling**

Replace the entire content of `components/SkillTreePreview.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const xpData = [
  [64, 36, 90, 16],
  [42, 0, 0, 30],
  [50, 45, 35, 0],
  [0, 0, 0, 0],
]

export default function SkillTreePreview() {
  const { t } = useLocale()
  const { tiers } = t.skillTree

  return (
    <section id="skill-tree" className="mx-auto max-w-[1100px] px-6 py-20 md:py-24 border-b-2 border-border">
      <ScrollReveal>
        <div className="text-center mb-10">
          <p className="text-[13px] text-primary uppercase tracking-[2px] mb-3">{t.skillTree.eyebrow}</p>
          <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] text-heading mb-4">{t.skillTree.title}</h2>
          <p className="text-[17px] text-muted leading-[1.7] max-w-[500px] mx-auto">{t.skillTree.subtitle}</p>
        </div>
      </ScrollReveal>

      <div className="flex flex-col gap-5">
        {tiers.map((tier, ti) => (
          <ScrollReveal key={tier.name} delay={ti * 120}>
            <div className="bg-bg border-2 border-border rounded-lg p-5 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] text-white shadow-[0_3px_0_rgba(0,0,0,0.15)]"
                  style={{ backgroundColor: tier.color }}
                >
                  {ti + 1}
                </div>
                <h3 className="text-sm text-heading">{tier.name}</h3>
                {ti === 3 && (
                  <span className="text-[9px] text-muted ml-auto">🔒</span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tier.skills.map((skill, si) => {
                  const xp = xpData[ti][si]
                  const isLocked = ti === 3
                  return (
                    <motion.div
                      key={skill}
                      whileHover={!isLocked ? { scale: 1.03 } : {}}
                      className={`rounded-lg px-3 py-2.5 border-2 ${isLocked ? 'opacity-40 border-border' : 'border-border'}`}
                      style={{ backgroundColor: isLocked ? '#F7F7F7' : tier.color + '12' }}
                    >
                      <p className="text-[11px] text-heading mb-1.5">{skill}</p>
                      <div className="h-2 rounded-pill overflow-hidden bg-border">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${xp}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: si * 0.1, ease: 'easeOut' }}
                          className="h-full rounded-pill"
                          style={{ backgroundColor: tier.color }}
                        />
                      </div>
                      {!isLocked && (
                        <p className="text-[9px] text-muted mt-1">Lv {Math.ceil(xp / 20)}/5</p>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SkillTreePreview.tsx
git commit -m "style: SkillTreePreview — 3D tier cards, pill progress bars"
```

---

### Task 15: Update Testimonials

**Files:**
- Modify: `components/Testimonials.tsx`

- [ ] **Step 1: Replace Testimonials styling**

Replace the entire content of `components/Testimonials.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const statColors = ['#34D399', '#38BDF8', '#A78BFA']

export default function Testimonials() {
  const { t } = useLocale()

  return (
    <section id="testimonials" className="mx-auto max-w-[1100px] px-6 py-20 md:py-24 bg-surface border-b-2 border-border">
      <ScrollReveal>
        <div className="text-center mb-10">
          <p className="text-[13px] text-primary uppercase tracking-[2px] mb-3">{t.testimonials.eyebrow}</p>
          <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] text-heading">{t.testimonials.title}</h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {t.testimonials.items.map((item, i) => (
          <ScrollReveal key={item.name} delay={i * 100}>
            <motion.div
              whileTap={{ y: 4, boxShadow: 'none' }}
              className="bg-bg border-2 border-border rounded-lg shadow-card h-full flex flex-col overflow-hidden cursor-pointer transition-all duration-100"
            >
              {/* Quote */}
              <div className="px-5 pt-5 pb-3 flex-1">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 0.15, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 + i * 0.1 }}
                  className="block text-4xl text-primary leading-none mb-1"
                >
                  &ldquo;
                </motion.span>
                <p className="text-[13px] text-text leading-relaxed italic">
                  {item.quote}
                </p>
              </div>

              {/* Avatar + name at bottom */}
              <div className="px-5 pb-5 pt-2 flex items-center gap-3 border-t-2 border-border mt-auto">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.15 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: statColors[i] + '18' }}
                >
                  {item.avatar}
                </motion.div>
                <div>
                  <p className="text-sm text-heading">{item.name}</p>
                  <p className="text-[10px] text-muted">{item.role}</p>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Testimonials.tsx
git commit -m "style: Testimonials — surface bg, 3D cards, updated colors"
```

---

### Task 16: Update FinalCTA

**Files:**
- Modify: `components/FinalCTA.tsx`

- [ ] **Step 1: Replace FinalCTA styling**

Replace the entire content of `components/FinalCTA.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import WaitlistForm from './WaitlistForm'
import ScrollReveal from './ScrollReveal'
import { Cat } from 'lucide-react'

export default function FinalCTA() {
  const { t } = useLocale()

  return (
    <>
      <section id="final-cta" className="py-20 md:py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-[640px] px-6 text-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-14 h-14 bg-primary-tint border-2 border-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_4px_0_#059669]"
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, -4, 0] }}
                transition={{ duration: 2, delay: 0.8, ease: 'easeInOut' }}
              >
                <Cat className="w-7 h-7 text-primary-dark" />
              </motion.div>
            </motion.div>
            <h2 className="text-[28px] md:text-[42px] tracking-[-1.5px] text-heading mb-4">
              {t.finalCTA.title}{' '}
              <em className="text-primary italic">{t.finalCTA.titleAccent}</em>
              {t.finalCTA.titleEnd}
            </h2>
            <p className="text-[17px] text-muted leading-relaxed mb-8">{t.finalCTA.subtitle}</p>
            <div className="mb-4">
              <WaitlistForm />
            </div>
            <p className="text-xs text-muted-light">{t.finalCTA.trustMeta}</p>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t-2 border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-heading">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t.footer.tagline}
          </div>
          <div className="flex gap-6">
            <a href="https://twitter.com/devpetapp" rel="noopener noreferrer" className="text-sm text-muted hover:text-heading transition-colors">{t.footer.links.twitter}</a>
            <a href="https://github.com/devpet" rel="noopener noreferrer" className="text-sm text-muted hover:text-heading transition-colors">{t.footer.links.github}</a>
            <a href="/privacy" className="text-sm text-muted hover:text-heading transition-colors">{t.footer.links.privacy}</a>
          </div>
          <p className="text-xs text-muted-light">{t.footer.copyright}</p>
        </div>
      </footer>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/FinalCTA.tsx
git commit -m "style: FinalCTA — 3D cat icon, updated footer"
```

---

### Task 17: Update CharacterPicker

**Files:**
- Modify: `components/CharacterPicker.tsx`

- [ ] **Step 1: Replace CharacterPicker styling with 3D modal and cards**

Replace the entire content of `components/CharacterPicker.tsx` with:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { useCompanion } from '@/lib/CompanionContext'
import { motion, AnimatePresence } from 'framer-motion'
import CharacterSvg from './CharacterSvg'

export default function CharacterPicker() {
  const { t } = useLocale()
  const { pick, dismissPicker } = useCompanion()
  const { characters } = t.meetYourPet
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setOpen(false)
    dismissPicker()
  }

  const handlePick = (i: number) => {
    setPicked(i)
    pick(characters[i].name)
    setTimeout(handleClose, 600)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-bg rounded-2xl border-2 border-border shadow-card-lg max-w-[800px] w-full max-h-[90dvh] overflow-y-auto pointer-events-auto p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <p className="text-[13px] text-primary uppercase tracking-[2px] mb-2">
                  {t.meetYourPet.eyebrow}
                </p>
                <h2 className="text-[28px] md:text-[32px] tracking-[-1px] text-heading mb-2">
                  {t.meetYourPet.title}
                </h2>
                <p className="text-sm text-muted">{t.meetYourPet.body}</p>
              </div>

              {/* Character grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {characters.map((char, i) => {
                  const isHovered = hovered === i
                  const isPicked = picked === i
                  const isDimmed = picked !== null && !isPicked

                  return (
                    <motion.div
                      key={char.name}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{
                        opacity: isDimmed ? 0.3 : 1,
                        y: 0,
                        scale: isPicked ? 1.04 : 1,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: picked === null ? i * 0.06 : 0,
                      }}
                      onHoverStart={() => picked === null && setHovered(i)}
                      onHoverEnd={() => setHovered(null)}
                      onClick={() => picked === null && handlePick(i)}
                      whileTap={picked === null ? { y: 4, boxShadow: 'none' } : {}}
                      className={`relative bg-bg rounded-lg border-2 overflow-hidden shadow-card cursor-pointer select-none transition-[border-color] duration-150
                        ${isPicked ? 'ring-2 ring-offset-2' : ''}`}
                      style={{
                        borderColor: isHovered || isPicked ? char.color : '#E5E5E5',
                        ['--tw-ring-color' as string]: char.color,
                      }}
                    >
                      {/* Character SVG */}
                      <div
                        className="w-full aspect-square flex items-center justify-center relative overflow-hidden"
                        style={{ backgroundColor: char.color + '10' }}
                      >
                        <motion.div
                          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          className="w-[70%] h-[70%]"
                        >
                          <CharacterSvg name={char.name} className="w-full h-full" />
                        </motion.div>
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm text-heading">{char.name}</h3>
                          <span
                            className="text-[8px] px-1.5 py-0.5 rounded-pill"
                            style={{ backgroundColor: char.color + '18', color: char.color }}
                          >
                            {char.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted mb-1">{char.species}</p>
                        <p className="text-[10px] text-muted leading-relaxed">{char.role}</p>
                      </div>

                      {/* Quote inline */}
                      <AnimatePresence>
                        {isHovered && !isPicked && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-3 pb-3 text-[10px] italic leading-relaxed"
                              style={{ color: char.color }}
                            >
                              &ldquo;{char.quote}&rdquo;
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Picked checkmark */}
                      <AnimatePresence>
                        {isPicked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                            style={{ backgroundColor: char.color }}
                          >
                            ✓
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              {/* Skip */}
              <div className="text-center mt-5">
                <button
                  onClick={handleClose}
                  className="text-xs text-muted hover:text-heading transition-colors"
                >
                  {picked !== null ? t.meetYourPet.growthNote : '← Bỏ qua'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/CharacterPicker.tsx
git commit -m "style: CharacterPicker — 3D modal, 3D character cards, spring animations"
```

---

### Task 18: Update AppWindowMockup

**Files:**
- Modify: `components/AppWindowMockup.tsx`

- [ ] **Step 1: Replace AppWindowMockup styling with 3D card treatment**

Replace the entire content of `components/AppWindowMockup.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [...ease] as [number, number, number, number] } } }
const slideIn = { hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [...ease] as [number, number, number, number] } } }

export default function AppWindowMockup() {
  const { t } = useLocale()
  const m = t.mockup

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="bg-bg border-2 border-border rounded-lg shadow-card overflow-hidden hidden md:block"
    >
      {/* Title bar */}
      <div className="bg-primary-tint border-b-2 border-border px-4 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-danger" />
        <div className="w-2.5 h-2.5 rounded-full bg-xp" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        <span className="mx-auto text-xs text-muted">VibeMon</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Greeting */}
        <motion.div variants={fadeUp}>
          <p className="text-[10px] text-primary tracking-widest uppercase">◆ VibeMon</p>
          <p className="text-lg text-heading mt-0.5">{m.greeting}</p>
        </motion.div>

        {/* Live session */}
        <motion.div variants={fadeUp} className="bg-primary-tint border-2 border-primary/20 rounded-lg px-3 py-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] text-primary-dark">{m.sessionLabel}</span>
            </div>
            <span className="text-[10px] font-mono text-primary">{m.sessionTime}</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            <motion.span variants={slideIn} className="text-[10px] bg-bg border-2 border-border rounded-lg px-1.5 py-0.5 flex items-center gap-1 shadow-[0_2px_0_#E5E5E5]">
              ⌨️ <strong>{m.tool1}</strong> <span className="text-muted">{m.tool1Detail}</span>
              <span className="w-1 h-1 rounded-full bg-primary" />
            </motion.span>
            <motion.span variants={slideIn} className="text-[10px] bg-bg border-2 border-border rounded-lg px-1.5 py-0.5 flex items-center gap-1 shadow-[0_2px_0_#E5E5E5]">
              🤖 <strong>{m.tool2}</strong> <span className="text-muted">{m.tool2Detail}</span>
              <span className="w-1 h-1 rounded-full bg-xp" />
            </motion.span>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <motion.div variants={fadeUp} className="bg-bg border-2 border-border rounded-lg px-3 py-2.5 flex items-center gap-2.5 shadow-card">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-xl font-mono text-streak leading-none">{m.streak}</p>
              <p className="text-[9px] text-muted mt-0.5">{m.streakLabel}</p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-bg border-2 border-border rounded-lg px-3 py-2.5 flex items-center gap-2.5 shadow-card">
            <div className="relative w-10 h-10">
              <svg width="40" height="40" className="-rotate-90">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#E5E5E5" strokeWidth="3" />
                <motion.circle
                  cx="20" cy="20" r="16" fill="none" stroke="#34D399" strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '100.5', strokeDashoffset: '100.5' }}
                  whileInView={{ strokeDashoffset: '33.5' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-heading">{m.goal}</span>
            </div>
            <div>
              <p className="text-[11px] text-heading">{m.goalLabel}</p>
              <p className="text-[9px] text-muted">{m.goalSub}</p>
            </div>
          </motion.div>
        </div>

        {/* Today's focus */}
        <motion.div variants={fadeUp}>
          <p className="text-xs text-heading mb-2">{m.focusTitle}</p>
          <div className="flex flex-col gap-1.5">
            <motion.div variants={slideIn} className="bg-bg border-2 border-border rounded-lg px-3 py-2 flex items-center gap-2.5 shadow-[0_2px_0_#E5E5E5]">
              <span className="text-sm">📏</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-heading">{m.focus1}</span>
                  <span className="text-[8px] text-danger bg-danger/10 px-1 py-px rounded-pill">HIGH</span>
                </div>
                <p className="text-[9px] text-muted">{m.focus1Why}</p>
              </div>
            </motion.div>
            <motion.div variants={slideIn} className="bg-bg border-2 border-border rounded-lg px-3 py-2 flex items-center gap-2.5 shadow-[0_2px_0_#E5E5E5]">
              <span className="text-sm">📄</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-heading">{m.focus2}</span>
                  <span className="text-[8px] text-danger bg-danger/10 px-1 py-px rounded-pill">HIGH</span>
                </div>
                <p className="text-[9px] text-muted">{m.focus2Why}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Yesterday's lesson */}
        <motion.div variants={fadeUp} className="bg-bg border-2 border-border rounded-lg px-3 py-2.5 relative overflow-hidden shadow-[0_2px_0_#E5E5E5]">
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
          />
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🎯</span>
            <div>
              <p className="text-[8px] text-primary uppercase">{m.lessonSkill}</p>
              <p className="text-[12px] text-heading">{m.lessonText}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/AppWindowMockup.tsx
git commit -m "style: AppWindowMockup — 3D cards, Duolingo colors, pill badges"
```

---

### Task 19: Update PetGuide Speech Bubbles

**Files:**
- Modify: `components/PetGuide.tsx`

- [ ] **Step 1: Update speech bubble styling to 3D raised style**

In `components/PetGuide.tsx`, make the following targeted replacements:

Replace the mobile speech bubble class (line ~261):
```
className="max-w-[180px] px-3 py-2 rounded-xl text-[11px] font-medium shadow-lg"
```
with:
```
className="max-w-[180px] px-3 py-2 rounded-lg text-[11px] shadow-card border-2"
```

Replace the mobile speech bubble style (line ~263-266):
```
style={{
  backgroundColor: color + '18',
  border: `1.5px solid ${color}30`,
  color: '#1A2E23',
}}
```
with:
```
style={{
  backgroundColor: '#FFFFFF',
  borderColor: '#E5E5E5',
  color: '#4B4B4B',
}}
```

Replace the mobile click quote class (line ~277):
```
className="px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg"
```
with:
```
className="px-3 py-1.5 rounded-pill text-[11px] shadow-[0_3px_0_rgba(0,0,0,0.15)]"
```

Replace the desktop speech bubble class (line ~335):
```
className={`absolute top-1/2 -translate-y-1/2 w-max max-w-[200px] px-3 py-2 rounded-xl text-[12px] font-medium shadow-lg pointer-events-none ${
```
with:
```
className={`absolute top-1/2 -translate-y-1/2 w-max max-w-[200px] px-3 py-2 rounded-lg text-[12px] shadow-card border-2 pointer-events-none ${
```

Replace the desktop speech bubble style (line ~339-342):
```
style={{
  backgroundColor: color + '15',
  border: `1.5px solid ${color}30`,
  color: '#1A2E23',
}}
```
with:
```
style={{
  backgroundColor: '#FFFFFF',
  borderColor: '#E5E5E5',
  color: '#4B4B4B',
}}
```

Replace the desktop speech arrow style (line ~350-354):
```
style={{
  backgroundColor: color + '15',
  ...(isLeft
    ? { borderLeft: `1.5px solid ${color}30`, borderBottom: `1.5px solid ${color}30` }
    : { borderRight: `1.5px solid ${color}30`, borderTop: `1.5px solid ${color}30` }),
}}
```
with:
```
style={{
  backgroundColor: '#FFFFFF',
  ...(isLeft
    ? { borderLeft: '2px solid #E5E5E5', borderBottom: '2px solid #E5E5E5' }
    : { borderRight: '2px solid #E5E5E5', borderTop: '2px solid #E5E5E5' }),
}}
```

Replace the desktop click quote class (line ~369):
```
className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shadow-lg pointer-events-none"
```
with:
```
className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-pill text-[11px] whitespace-nowrap shadow-[0_3px_0_rgba(0,0,0,0.15)] pointer-events-none"
```

- [ ] **Step 2: Commit**

```bash
git add components/PetGuide.tsx
git commit -m "style: PetGuide — 3D speech bubbles, neutral borders"
```

---

### Task 20: Build and Visual Verification

- [ ] **Step 1: Run the build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Run dev server and visually verify**

Run: `npm run dev`
Expected: All 10 sections render with Duolingo-style:
- Varela Round font throughout
- White/surface alternating backgrounds
- 3D push-down buttons and cards
- Bold saturated secondary colors
- Spring animations on scroll reveal
- Grey neutral borders instead of green-tinted
- No broken styles or missing colors

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "style: complete Duolingo-style visual overhaul of landing page"
```
