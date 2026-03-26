'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import PetSlot from './PetSlot'

const statColors = ['#34D399', '#6BCB77', '#7B8CE0']

export default function Testimonials() {
  const { t } = useLocale()

  return (
    <section id="testimonials" className="mx-auto max-w-[1100px] px-6 py-16 md:py-20 border-t border-border">
      <ScrollReveal>
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-mint uppercase tracking-[0.12em] mb-3">{t.testimonials.eyebrow}</p>
          <h2 className="text-3xl md:text-[38px] font-black tracking-[-1.5px]">{t.testimonials.title}</h2>
        </div>
      </ScrollReveal>
      <div className="relative">
        <PetSlot section="testimonials" className="hidden md:block absolute -left-4 top-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {t.testimonials.items.map((item, i) => (
          <ScrollReveal key={item.name} delay={i * 120}>
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 4px 20px rgba(26,46,35,0.10)' }}
              transition={{ duration: 0.2 }}
              className="bg-card-bg border border-border rounded-lg shadow-card h-full flex flex-col overflow-hidden"
            >
              {/* Quote */}
              <div className="px-5 pt-5 pb-3 flex-1">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 0.15, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                  className="block text-4xl font-black text-mint leading-none mb-1"
                >
                  &ldquo;
                </motion.span>
                <p className="text-[13px] text-text leading-relaxed italic">
                  {item.quote}
                </p>
              </div>

              {/* Avatar + name at bottom */}
              <div className="px-5 pb-5 pt-2 flex items-center gap-3 border-t border-border mt-auto">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.15 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: statColors[i] + '18' }}
                >
                  {item.avatar}
                </motion.div>
                <div>
                  <p className="text-sm font-extrabold text-text">{item.name}</p>
                  <p className="text-[10px] text-muted">{item.role}</p>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
