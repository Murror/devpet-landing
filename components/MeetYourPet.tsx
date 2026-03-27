'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import CharacterSvg from './CharacterSvg'

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
          animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.2, rotate: p.rotation }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute left-1/2 top-1/3"
          style={{ width: p.size, height: p.size, borderRadius: p.size > 6 ? '2px' : '50%', backgroundColor: p.color }}
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
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45" style={{ backgroundColor: char.color }} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {confettiChar === i && <Confetti color={char.color} />}
                  <motion.div
                    onClick={() => handleClick(i)}
                    whileTap={{ y: 4, boxShadow: 'none' }}
                    className={`bg-bg rounded-lg border-2 overflow-hidden shadow-card cursor-pointer select-none transition-all duration-100
                      ${isActive ? 'ring-2 ring-offset-2' : ''}`}
                    style={{ borderColor: isActive ? char.color : '#E5E5E5', ringColor: isActive ? char.color : undefined } as React.CSSProperties}
                  >
                    <div className="w-full aspect-square flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: char.color + '10' }}>
                      <motion.div
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="w-[70%] h-[70%]"
                      >
                        <CharacterSvg name={char.name} className="w-full h-full" />
                      </motion.div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm text-heading">{char.name}</h3>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-pill" style={{ backgroundColor: char.color + '18', color: char.color }}>{char.badge}</span>
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
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            {t.meetYourPet.growthNote}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
