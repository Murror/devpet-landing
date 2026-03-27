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
