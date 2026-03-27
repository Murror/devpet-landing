'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'

export default function HowItWorks() {
  const { t } = useLocale()
  const { steps } = t.howItWorks

  return (
    <section id="how-it-works" className="mx-auto max-w-[1100px] px-6 py-16 md:py-20 border-t border-border">
      <ScrollReveal>
        <SectionHeader
          eyebrow={t.howItWorks.eyebrow}
          title={t.howItWorks.title}
          subtitle={t.howItWorks.subtitle}
        />
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <ScrollReveal key={step.num} delay={i * 150}>
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 4px 20px rgba(26,46,35,0.10)' }}
              transition={{ duration: 0.3 }}
              className="relative bg-card-bg border border-border rounded-lg p-7 shadow-card h-full group"
            >
              <div className="w-9 h-9 bg-mint-light rounded-sm flex items-center justify-center text-sm font-extrabold text-mint-dark mb-4">
                {step.num}
              </div>
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.15, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                className="mb-3"
              >
                <Icon name={step.icon} className="w-7 h-7 text-mint" />
              </motion.div>
              <h3 className="text-base font-extrabold mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.15, ease: 'easeOut' }}
                  className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-warm-bg border border-border rounded-full items-center justify-center text-[11px] text-muted z-10"
                >
                  →
                </motion.div>
              )}
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
