'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'
import CharacterScene from './CharacterScene'

const iconBgClasses = ['bg-primary-tint', 'bg-xp-tint', 'bg-premium-tint', 'bg-info-tint']
const iconTextClasses = ['text-primary-dark', 'text-xp-dark', 'text-premium-dark', 'text-info-dark']

export default function Features() {
  const { t } = useLocale()

  return (
    <section id="features" className="py-20 md:py-24 border-b-2 border-border">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        <div>
          <ScrollReveal>
            <SectionHeader eyebrow={t.features.eyebrow} title={t.features.title} subtitle={t.features.subtitle} />
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.features.cards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 100}>
                <motion.div whileTap={{ y: 4, boxShadow: 'none' }} className="bg-bg border-2 border-border rounded-lg p-5 shadow-card h-full cursor-pointer transition-all duration-100">
                  <div className={`w-10 h-10 ${iconBgClasses[i]} rounded-md flex items-center justify-center mb-3`}>
                    <Icon name={card.icon} className={`w-5 h-5 ${iconTextClasses[i]}`} />
                  </div>
                  <h3 className="text-sm text-heading mb-1">{card.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{card.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal>
          <CharacterScene name="Sage" color="#085041" />
        </ScrollReveal>
      </div>
    </section>
  )
}
