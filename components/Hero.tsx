'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import WaitlistForm from './WaitlistForm'
import AppWindowMockup from './AppWindowMockup'

export default function Hero() {
  const { t } = useLocale()

  return (
    <section id="waitlist" className="mx-auto max-w-[1100px] px-6 py-16 md:py-20 grid md:grid-cols-[1fr_1.1fr] gap-16 items-center">
      <div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-1.5 bg-mint-light border border-[#EAB080] rounded-pill px-3 py-1.5 text-xs font-semibold text-mint-dark mb-6"
        >
          <span className="w-1.5 h-1.5 bg-mint rounded-full" />
          {t.hero.badge}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="text-4xl md:text-[52px] font-black leading-[1.1] tracking-[-2px] mb-5"
        >
          {t.hero.title}{' '}
          <em className="text-mint italic">{t.hero.titleAccent}</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          className="text-base md:text-[17px] text-muted leading-[1.7] max-w-[440px] mb-6"
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Inline proof stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.25 }}
          className="flex gap-5 mb-6"
        >
          {t.hero.proofStats.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-lg font-extrabold text-text">{stat.value}</span>
              <span className="text-[10px] text-muted">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          className="mb-3"
        >
          <WaitlistForm />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-xs text-muted-light"
        >
          {t.hero.trustMeta}
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 30, scale: 0.97 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
      >
        <AppWindowMockup />
      </motion.div>
    </section>
  )
}
