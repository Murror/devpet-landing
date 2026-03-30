'use client'

import { useRef, useState, useEffect } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import WaitlistForm from './WaitlistForm'
import CharacterScene from './CharacterScene'

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
    <section id="hero" data-section-color="#FFFFFF" className="mx-auto max-w-[1100px] px-6 py-12 md:py-24 grid md:grid-cols-[1fr_1fr] gap-8 md:gap-12 items-center">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...duoSpring }}
          className="inline-flex items-center gap-1.5 bg-primary-tint border border-primary/20 rounded-pill px-3 py-1.5 text-xs text-primary-dark mb-6 shadow-soft"
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
          className="flex flex-wrap gap-3 sm:gap-5 mb-6"
        >
          {t.hero.proofStats.map((stat, i) => (
            <div key={i} className="flex flex-col bg-bg border border-border rounded-lg px-3 py-2 shadow-card">
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
      <div className="hidden md:grid grid-cols-2 gap-4">
        {heroCharacters.map((char, i) => (
          <motion.div
            key={char.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...duoSpring, delay: 0.2 + i * 0.1 }}
            style={{ transform: `translateY(${char.offsetY}px)` }}
          >
            <CharacterScene name={char.name} color={char.color} withBackground />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
