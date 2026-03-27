# Character Presence Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make characters the visual centerpiece of every section using alternating Duolingo-style layout, remove PetGuide/CharacterPicker/MeetYourPet/AppWindowMockup.

**Architecture:** First remove unused components and infrastructure (CompanionContext, CharacterPicker, PetGuide, MeetYourPet, AppWindowMockup), then restructure each section to include a character in an alternating left/right layout.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 3, Framer Motion 12

---

### Task 1: Remove CompanionContext and clean up layout/page

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Delete: `lib/CompanionContext.tsx`
- Delete: `components/CharacterPicker.tsx`
- Delete: `components/PetGuide.tsx`
- Delete: `components/MeetYourPet.tsx`
- Delete: `components/AppWindowMockup.tsx`

- [ ] **Step 1: Replace app/layout.tsx — remove CompanionProvider**

Replace the entire content of `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { Varela_Round } from 'next/font/google'
import { LocaleProvider } from '@/lib/LocaleProvider'
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
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace app/page.tsx — remove deleted components**

Replace the entire content of `app/page.tsx` with:

```tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WhyVibeCode from '@/components/WhyVibeCode'
import HowItWorks from '@/components/HowItWorks'
import Features from '@/components/Features'
import MidCTA from '@/components/MidCTA'
import SkillTreePreview from '@/components/SkillTreePreview'
import Testimonials from '@/components/Testimonials'
import FinalCTA from '@/components/FinalCTA'

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <WhyVibeCode />
      <HowItWorks />
      <Features />
      <MidCTA />
      <SkillTreePreview />
      <Testimonials />
      <FinalCTA />
    </main>
  )
}
```

- [ ] **Step 3: Delete unused files**

```bash
rm components/CharacterPicker.tsx components/PetGuide.tsx components/MeetYourPet.tsx components/AppWindowMockup.tsx lib/CompanionContext.tsx
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove CompanionContext, CharacterPicker, PetGuide, MeetYourPet, AppWindowMockup"
```

---

### Task 2: Rewrite Hero with 4-character grid

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Replace Hero with character grid**

Replace the entire content of `components/Hero.tsx` with:

```tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import WaitlistForm from './WaitlistForm'
import CharacterSvg from './CharacterSvg'

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
    num, prefix, suffix,
    format: (n: number) => {
      let s = decimals > 0 ? n.toFixed(decimals) : Math.round(n).toString()
      if (hasComma) s = Number(s).toLocaleString('en-US')
      return prefix + s + suffix
    },
  }
}

function CountUp({ value, duration = 1.5, delay = 0 }: { value: string; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value.replace(/[\d]/g, '0'))
  const parsed = parseStat(value)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!parsed || hasRun.current) return
    hasRun.current = true
    const delayMs = delay * 1000
    const timeout = setTimeout(() => {
      const start = performance.now()
      const durationMs = duration * 1000
      const tick = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / durationMs, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplay(parsed.format(eased * parsed.num))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delayMs)
    return () => clearTimeout(timeout)
  }, [])

  return <span ref={ref}>{parsed ? display : value}</span>
}

const duoSpring = { type: 'spring' as const, stiffness: 300, damping: 20 }

const heroCharacters = [
  { name: 'Byte', color: '#534AB7', offsetY: -8 },
  { name: 'Nova', color: '#BA7517', offsetY: 8 },
  { name: 'Sage', color: '#085041', offsetY: -4 },
  { name: 'Glitch', color: '#993556', offsetY: 12 },
]

export default function Hero() {
  const { t } = useLocale()

  return (
    <section id="hero" className="mx-auto max-w-[1100px] px-6 py-20 md:py-24 grid md:grid-cols-[1fr_1fr] gap-12 items-center">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...duoSpring }}
          className="inline-flex items-center gap-1.5 bg-primary-tint border-2 border-primary rounded-pill px-3 py-1.5 text-xs text-primary-dark mb-6 shadow-[0_3px_0_#059669]"
        >
          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
          {t.hero.badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...duoSpring, delay: 0.1 }}
          className="text-[36px] md:text-[48px] leading-[1.1] tracking-[-2px] text-heading mb-5"
        >
          {t.hero.title}{' '}
          <em className="text-primary italic">{t.hero.titleAccent}</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...duoSpring, delay: 0.2 }}
          className="text-[17px] text-muted leading-[1.7] max-w-[440px] mb-6"
        >
          {t.hero.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...duoSpring, delay: 0.3 }}
          className="flex gap-5 mb-6"
        >
          {t.hero.proofStats.map((stat, i) => (
            <div key={i} className="flex flex-col bg-bg border-2 border-border rounded-lg px-3 py-2 shadow-card">
              <span className="text-lg text-heading tabular-nums">
                <CountUp value={stat.value} duration={1.5} delay={0.4 + i * 0.15} />
              </span>
              <span className="text-[10px] text-muted">{stat.label}</span>
            </div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...duoSpring, delay: 0.4 }}
          className="mb-3"
        >
          <WaitlistForm />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...duoSpring, delay: 0.5 }}
          className="text-xs text-muted-light"
        >
          {t.hero.trustMeta}
        </motion.p>
      </div>

      {/* 4-character grid */}
      <div className="grid grid-cols-2 gap-4">
        {heroCharacters.map((char, i) => (
          <motion.div
            key={char.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...duoSpring, delay: 0.2 + i * 0.1 }}
            style={{ transform: `translateY(${char.offsetY}px)` }}
          >
            <div
              className="aspect-square rounded-2xl border-2 border-border shadow-card flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: char.color + '15' }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-[70%] h-[70%]"
              >
                <CharacterSvg name={char.name} className="w-full h-full" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: Hero with 4-character grid replacing AppWindowMockup"
```

---

### Task 3: WhyVibeCode — add Glitch on right

**Files:**
- Modify: `components/WhyVibeCode.tsx`

- [ ] **Step 1: Replace WhyVibeCode with alternating layout (text left, Glitch right)**

Replace the entire content of `components/WhyVibeCode.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'
import CharacterSvg from './CharacterSvg'

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
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        {/* Text content */}
        <div>
          <ScrollReveal>
            <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] leading-[1.15] text-heading mb-8">
              {data.title}
              <br />
              <em className="text-primary italic">{data.titleAccent}</em>
            </h2>
          </ScrollReveal>

          <div className="flex flex-col gap-4 mb-8">
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
            <p className="text-[17px] text-muted leading-relaxed">{data.cta}</p>
          </ScrollReveal>
        </div>

        {/* Glitch character */}
        <ScrollReveal>
          <div
            className="aspect-square rounded-2xl flex items-center justify-center max-w-[280px] mx-auto"
            style={{ backgroundColor: '#99355615' }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[70%] h-[70%]"
            >
              <CharacterSvg name="Glitch" className="w-full h-full" />
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/WhyVibeCode.tsx
git commit -m "feat: WhyVibeCode — add Glitch character right side, alternating layout"
```

---

### Task 4: HowItWorks — add Nova on left

**Files:**
- Modify: `components/HowItWorks.tsx`

- [ ] **Step 1: Replace HowItWorks with alternating layout (Nova left, text right)**

Replace the entire content of `components/HowItWorks.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'
import CharacterSvg from './CharacterSvg'

const stepColors = ['#34D399', '#38BDF8', '#FBBF24']
const stepShadows = ['#059669', '#0284C7', '#D97706']

export default function HowItWorks() {
  const { t } = useLocale()
  const { steps } = t.howItWorks

  return (
    <section id="how-it-works" className="py-20 md:py-24 bg-surface border-b-2 border-border">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
        {/* Nova character */}
        <ScrollReveal>
          <div
            className="aspect-square rounded-2xl flex items-center justify-center max-w-[280px] mx-auto"
            style={{ backgroundColor: '#BA751715' }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[70%] h-[70%]"
            >
              <CharacterSvg name="Nova" className="w-full h-full" />
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Text content */}
        <div>
          <ScrollReveal>
            <SectionHeader
              eyebrow={t.howItWorks.eyebrow}
              title={t.howItWorks.title}
              subtitle={t.howItWorks.subtitle}
            />
          </ScrollReveal>
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 100}>
                <motion.div
                  whileTap={{ y: 4, boxShadow: 'none' }}
                  className="bg-bg border-2 border-border rounded-lg p-5 shadow-card cursor-pointer transition-all duration-100 flex items-start gap-4"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-sm text-white"
                    style={{ backgroundColor: stepColors[i], boxShadow: `0 3px 0 ${stepShadows[i]}` }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-base text-heading mb-1">{step.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/HowItWorks.tsx
git commit -m "feat: HowItWorks — add Nova character left side, alternating layout"
```

---

### Task 5: Features — add Sage on right

**Files:**
- Modify: `components/Features.tsx`

- [ ] **Step 1: Replace Features with alternating layout (text left, Sage right)**

Replace the entire content of `components/Features.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'
import CharacterSvg from './CharacterSvg'

const iconBgClasses = ['bg-primary-tint', 'bg-xp-tint', 'bg-premium-tint', 'bg-info-tint']
const iconTextClasses = ['text-primary-dark', 'text-xp-dark', 'text-premium-dark', 'text-info-dark']

export default function Features() {
  const { t } = useLocale()

  return (
    <section id="features" className="py-20 md:py-24 border-b-2 border-border">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        {/* Text content */}
        <div>
          <ScrollReveal>
            <SectionHeader
              eyebrow={t.features.eyebrow}
              title={t.features.title}
              subtitle={t.features.subtitle}
            />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.features.cards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 100}>
                <motion.div
                  whileTap={{ y: 4, boxShadow: 'none' }}
                  className="bg-bg border-2 border-border rounded-lg p-5 shadow-card h-full cursor-pointer transition-all duration-100"
                >
                  <div className={`w-10 h-10 ${iconBgClasses[i]} rounded-md flex items-center justify-center mb-3`}>
                    <Icon name={card.icon} className={`w-5 h-5 ${iconTextClasses[i]}`} />
                  </div>
                  <h3 className="text-sm text-heading mb-1">{card.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Sage character */}
        <ScrollReveal>
          <div
            className="aspect-square rounded-2xl flex items-center justify-center max-w-[280px] mx-auto"
            style={{ backgroundColor: '#08504115' }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[70%] h-[70%]"
            >
              <CharacterSvg name="Sage" className="w-full h-full" />
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Features.tsx
git commit -m "feat: Features — add Sage character right side, alternating layout"
```

---

### Task 6: SkillTreePreview — add Crash on left

**Files:**
- Modify: `components/SkillTreePreview.tsx`

- [ ] **Step 1: Replace SkillTreePreview with alternating layout (Crash left, text right)**

Replace the entire content of `components/SkillTreePreview.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import CharacterSvg from './CharacterSvg'

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
    <section id="skill-tree" className="py-20 md:py-24 border-b-2 border-border">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
        {/* Crash character */}
        <ScrollReveal>
          <div
            className="aspect-square rounded-2xl flex items-center justify-center max-w-[280px] mx-auto"
            style={{ backgroundColor: '#A32D2D15' }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[70%] h-[70%]"
            >
              <CharacterSvg name="Crash" className="w-full h-full" />
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Text content */}
        <div>
          <ScrollReveal>
            <div className="mb-8">
              <p className="text-[13px] text-primary uppercase tracking-[2px] mb-3">{t.skillTree.eyebrow}</p>
              <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] text-heading mb-4">{t.skillTree.title}</h2>
              <p className="text-[17px] text-muted leading-[1.7] max-w-[500px]">{t.skillTree.subtitle}</p>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-4">
            {tiers.map((tier, ti) => (
              <ScrollReveal key={tier.name} delay={ti * 120}>
                <div className="bg-bg border-2 border-border rounded-lg p-4 shadow-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] text-white shadow-[0_3px_0_rgba(0,0,0,0.15)]"
                      style={{ backgroundColor: tier.color }}
                    >
                      {ti + 1}
                    </div>
                    <h3 className="text-sm text-heading">{tier.name}</h3>
                    {ti === 3 && <span className="text-[9px] text-muted ml-auto">🔒</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {tier.skills.map((skill, si) => {
                      const xp = xpData[ti][si]
                      const isLocked = ti === 3
                      return (
                        <div
                          key={skill}
                          className={`rounded-lg px-3 py-2 border-2 ${isLocked ? 'opacity-40 border-border' : 'border-border'}`}
                          style={{ backgroundColor: isLocked ? '#F7F7F7' : tier.color + '12' }}
                        >
                          <p className="text-[11px] text-heading mb-1">{skill}</p>
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
                        </div>
                      )
                    })}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SkillTreePreview.tsx
git commit -m "feat: SkillTreePreview — add Crash character left side, alternating layout"
```

---

### Task 7: Testimonials — add Luna on right

**Files:**
- Modify: `components/Testimonials.tsx`

- [ ] **Step 1: Replace Testimonials with alternating layout (text left, Luna right)**

Replace the entire content of `components/Testimonials.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import CharacterSvg from './CharacterSvg'

const statColors = ['#34D399', '#38BDF8', '#A78BFA']

export default function Testimonials() {
  const { t } = useLocale()

  return (
    <section id="testimonials" className="py-20 md:py-24 bg-surface border-b-2 border-border">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        {/* Text content */}
        <div>
          <ScrollReveal>
            <div className="mb-8">
              <p className="text-[13px] text-primary uppercase tracking-[2px] mb-3">{t.testimonials.eyebrow}</p>
              <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] text-heading">{t.testimonials.title}</h2>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-4">
            {t.testimonials.items.map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 100}>
                <motion.div
                  whileTap={{ y: 4, boxShadow: 'none' }}
                  className="bg-bg border-2 border-border rounded-lg shadow-card cursor-pointer transition-all duration-100 overflow-hidden"
                >
                  <div className="px-5 pt-4 pb-3">
                    <p className="text-[13px] text-text leading-relaxed italic">{item.quote}</p>
                  </div>
                  <div className="px-5 pb-4 pt-2 flex items-center gap-3 border-t-2 border-border">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: statColors[i] + '18' }}
                    >
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-sm text-heading">{item.name}</p>
                      <p className="text-[10px] text-muted">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Luna character */}
        <ScrollReveal>
          <div
            className="aspect-square rounded-2xl flex items-center justify-center max-w-[280px] mx-auto"
            style={{ backgroundColor: '#534AB715' }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[70%] h-[70%]"
            >
              <CharacterSvg name="Luna" className="w-full h-full" />
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Testimonials.tsx
git commit -m "feat: Testimonials — add Luna character right side, alternating layout"
```

---

### Task 8: FinalCTA — add Null on left

**Files:**
- Modify: `components/FinalCTA.tsx`

- [ ] **Step 1: Replace FinalCTA with alternating layout (Null left, CTA right)**

Replace the entire content of `components/FinalCTA.tsx` with:

```tsx
'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import WaitlistForm from './WaitlistForm'
import ScrollReveal from './ScrollReveal'
import CharacterSvg from './CharacterSvg'

export default function FinalCTA() {
  const { t } = useLocale()

  return (
    <>
      <section id="final-cta" className="py-20 md:py-24">
        <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          {/* Null character */}
          <ScrollReveal>
            <div
              className="aspect-square rounded-2xl flex items-center justify-center max-w-[280px] mx-auto"
              style={{ backgroundColor: '#3B6D1115' }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-[70%] h-[70%]"
              >
                <CharacterSvg name="Null" className="w-full h-full" />
              </motion.div>
            </div>
          </ScrollReveal>

          {/* CTA content */}
          <ScrollReveal>
            <div>
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
        </div>
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
git commit -m "feat: FinalCTA — add Null character left side, alternating layout"
```

---

### Task 9: Build and Verify

- [ ] **Step 1: Run the build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Visual verification**

Run: `npm run dev`
Expected:
- No CharacterPicker modal on load
- No floating PetGuide
- No MeetYourPet section
- Hero shows 4 characters (Byte, Nova, Sage, Glitch) in 2x2 grid
- WhyVibeCode: text left, Glitch right
- HowItWorks: Nova left, text right
- Features: text left, Sage right
- MidCTA: green bg, no character (unchanged)
- SkillTree: Crash left, text right
- Testimonials: text left, Luna right
- FinalCTA: Null left, CTA right
- All characters have idle float animation
- Mobile: single column, characters stack naturally

- [ ] **Step 3: Commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address any build/visual issues"
```
