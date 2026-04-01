'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import CharacterScene from './CharacterScene'

const statColors = ['#7B6DC8', '#7C9DF5', '#A78BFA']

export default function Testimonials() {
  const { t } = useLocale()

  return (
    <section id="testimonials" data-section-color="#F3F0FD" className="py-20 md:py-24 border-b border-border/50">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-12 items-center">
        <div>
          <ScrollReveal>
            <div className="mb-8">
              <p className="text-[13px] text-primary uppercase tracking-[2px] mb-3">{t.testimonials.eyebrow}</p>
              <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] text-heading">{t.testimonials.title}</h2>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-4">
            {t.testimonials.items.map((item, i) => (
              <ScrollReveal key={item.name} delay={i * 100}>
                <motion.div whileTap={{ scale: 0.98 }} className="bg-bg border border-border rounded-lg shadow-card cursor-pointer transition-all duration-100 overflow-hidden">
                  <div className="px-5 pt-4 pb-3">
                    <p className="text-[13px] text-text leading-relaxed italic">{item.quote}</p>
                  </div>
                  <div className="px-5 pb-4 pt-2 flex items-center gap-3 border-t border-border/50">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: statColors[i] + '18' }}>
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-sm text-heading">{item.name}</p>
                      <p className="text-[10px] text-muted">{item.role}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal>
          <CharacterScene name="Luna" color="#534AB7" />
        </ScrollReveal>
      </div>
    </section>
  )
}
