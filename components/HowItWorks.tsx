'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'

const stepColors = ['#34D399', '#38BDF8', '#FBBF24']
const stepShadows = ['#059669', '#0284C7', '#D97706']

export default function HowItWorks() {
  const { t } = useLocale()
  const { steps } = t.howItWorks

  return (
    <section id="how-it-works" className="mx-auto max-w-[1100px] px-6 py-20 md:py-24 bg-surface border-b-2 border-border">
      <ScrollReveal>
        <SectionHeader
          eyebrow={t.howItWorks.eyebrow}
          title={t.howItWorks.title}
          subtitle={t.howItWorks.subtitle}
        />
      </ScrollReveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <ScrollReveal key={step.num} delay={i * 100}>
            <motion.div
              whileTap={{ y: 4, boxShadow: 'none' }}
              className="relative bg-bg border-2 border-border rounded-lg p-7 shadow-card h-full cursor-pointer transition-all duration-100"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm text-white mb-4"
                style={{ backgroundColor: stepColors[i], boxShadow: `0 3px 0 ${stepShadows[i]}` }}
              >
                {step.num}
              </div>
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.15, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 + i * 0.15 }}
                className="mb-3"
              >
                <Icon name={step.icon} className="w-7 h-7 text-primary" />
              </motion.div>
              <h3 className="text-base text-heading mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.15, ease: 'easeOut' }}
                  className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-bg border-2 border-border rounded-full items-center justify-center text-[11px] text-muted z-10 shadow-[0_2px_0_#E5E5E5]"
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
