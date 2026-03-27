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
      <div className="bg-primary-tint border-b-2 border-border px-4 py-3 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-danger" />
        <div className="w-2.5 h-2.5 rounded-full bg-xp" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        <span className="mx-auto text-xs text-muted">VibeMon</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <motion.div variants={fadeUp}>
          <p className="text-[10px] text-primary tracking-widest uppercase">◆ VibeMon</p>
          <p className="text-lg text-heading mt-0.5">{m.greeting}</p>
        </motion.div>

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
