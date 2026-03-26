'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import PetSlot from './PetSlot'

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
    <section id="skill-tree" className="mx-auto max-w-[1100px] px-6 py-16 md:py-20 border-t border-border">
      <ScrollReveal>
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-mint uppercase tracking-[0.12em] mb-3">{t.skillTree.eyebrow}</p>
          <h2 className="text-3xl md:text-[38px] font-black tracking-[-1.5px] mb-4">{t.skillTree.title}</h2>
          <p className="text-base text-muted leading-[1.7] max-w-[500px] mx-auto">{t.skillTree.subtitle}</p>
        </div>
      </ScrollReveal>
      <div className="relative">
        <PetSlot section="skillTree" className="hidden md:block absolute -right-4 top-0" />
      </div>

      <div className="flex flex-col gap-5">
        {tiers.map((tier, ti) => (
          <ScrollReveal key={tier.name} delay={ti * 120}>
            <div className="bg-card-bg border border-border rounded-lg p-5 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-extrabold text-white"
                  style={{ backgroundColor: tier.color }}
                >
                  {ti + 1}
                </div>
                <h3 className="text-sm font-extrabold">{tier.name}</h3>
                {ti === 3 && (
                  <span className="text-[9px] font-bold text-muted ml-auto">🔒</span>
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
                      className={`rounded-md px-3 py-2.5 ${isLocked ? 'opacity-40' : ''}`}
                      style={{ backgroundColor: tier.color + '12' }}
                    >
                      <p className="text-[11px] font-bold text-text mb-1.5">{skill}</p>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: tier.color + '25' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${xp}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: si * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                          className="h-full rounded-full"
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
