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

export default function Hero() {
  const { t } = useLocale()
  const { pickerDismissed } = useCompanion()

  const show = pickerDismissed ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }

  return (
    <section id="hero" className="mx-auto max-w-[1100px] px-6 py-16 md:py-20 grid md:grid-cols-[1fr_1.1fr] gap-16 items-center">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-1.5 bg-mint-light border border-[#6EE7B7] rounded-pill px-3 py-1.5 text-xs font-semibold text-mint-dark mb-6"
        >
          <span className="w-1.5 h-1.5 bg-mint rounded-full" />
          {t.hero.badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="text-4xl md:text-[52px] font-black leading-[1.1] tracking-[-2px] mb-5"
        >
          {t.hero.title}{' '}
          <em className="text-mint italic">{t.hero.titleAccent}</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="text-base md:text-[17px] text-muted leading-[1.7] max-w-[440px] mb-6"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Inline proof stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="flex gap-5 mb-6"
        >
          {t.hero.proofStats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-lg font-extrabold text-text tabular-nums">
                <CountUp value={stat.value} duration={1.5} delay={0.4 + i * 0.15} enabled={pickerDismissed} />
              </span>
              <span className="text-[10px] text-muted">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={show}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="mb-3"
        >
          <WaitlistForm />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={pickerDismissed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          className="text-xs text-muted-light"
        >
          {t.hero.trustMeta}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={show}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
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
