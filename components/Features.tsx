'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'

const iconBgClasses = ['bg-mint-light', 'bg-yellow-bg', 'bg-purple-bg', 'bg-mint-light']

export default function Features() {
  const { t } = useLocale()

  return (
    <section id="features" className="mx-auto max-w-[1100px] px-6 py-16 md:py-20 border-t border-border">
      <ScrollReveal>
        <SectionHeader
          eyebrow={t.features.eyebrow}
          title={t.features.title}
          subtitle={t.features.subtitle}
        />
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {t.features.cards.map((card, i) => (
          <ScrollReveal key={card.title} delay={i * 150}>
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 4px 20px rgba(26,46,35,0.10)' }}
              transition={{ duration: 0.3 }}
              className="bg-card-bg border border-border rounded-lg p-7 shadow-card h-full"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.12, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                className={`w-12 h-12 ${iconBgClasses[i]} rounded-lg flex items-center justify-center mb-4`}
              >
                <Icon name={card.icon} className={`w-6 h-6 ${['text-mint-dark', 'text-yellow', 'text-purple', 'text-mint-dark'][i]}`} />
              </motion.div>
              <h3 className="text-base font-extrabold mb-2">{card.title}</h3>
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
                    <span className="text-[10px] text-mint mt-1 flex-shrink-0">✦</span>
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
