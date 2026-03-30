'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import CharacterScene from './CharacterScene'

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
    <section id="skill-tree" data-section-color="#FDF1F1" className="py-20 md:py-24 border-b border-border/50">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-12 items-center">
        <ScrollReveal className="hidden md:block">
          <CharacterScene name="Crash" color="#A32D2D" />
        </ScrollReveal>

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
                <div className="bg-bg border border-border rounded-lg p-4 shadow-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] text-white shadow-[0_3px_0_rgba(0,0,0,0.15)]" style={{ backgroundColor: tier.color }}>
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
                        <div key={skill} className={`rounded-lg px-3 py-2 border ${isLocked ? 'opacity-40 border-border' : 'border-border'}`} style={{ backgroundColor: isLocked ? '#F7F7F7' : tier.color + '12' }}>
                          <p className="text-[11px] text-heading mb-1">{skill}</p>
                          <div className="h-2 rounded-pill overflow-hidden bg-border">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${xp}%` }} viewport={{ once: true }} transition={{ duration: 0.3, delay: si * 0.1, ease: 'easeOut' }} className="h-full rounded-pill" style={{ backgroundColor: tier.color }} />
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
