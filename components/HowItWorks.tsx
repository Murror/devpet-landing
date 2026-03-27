'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'
import CharacterScene from './CharacterScene'

const stepColors = ['#34D399', '#38BDF8', '#FBBF24']
const stepShadows = ['#059669', '#0284C7', '#D97706']

export default function HowItWorks() {
  const { t } = useLocale()
  const { steps } = t.howItWorks

  return (
    <section id="how-it-works" className="py-20 md:py-24 bg-surface border-b-2 border-border">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
        <ScrollReveal>
          <CharacterScene name="Nova" color="#BA7517" />
        </ScrollReveal>

        <div>
          <ScrollReveal>
            <SectionHeader eyebrow={t.howItWorks.eyebrow} title={t.howItWorks.title} subtitle={t.howItWorks.subtitle} />
          </ScrollReveal>
          <div className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 100}>
                <motion.div whileTap={{ y: 4, boxShadow: 'none' }} className="bg-bg border-2 border-border rounded-lg p-5 shadow-card cursor-pointer transition-all duration-100 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-sm text-white" style={{ backgroundColor: stepColors[i], boxShadow: `0 3px 0 ${stepShadows[i]}` }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-base text-heading mb-1">{step.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
