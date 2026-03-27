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
