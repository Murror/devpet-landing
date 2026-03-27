'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'
import CharacterScene from './CharacterScene'

export default function WhyVibeCode() {
  const { t } = useLocale()
  const data = (t as Record<string, unknown>).whyVibeCode as {
    title: string
    titleAccent: string
    pains: { icon: string; text: string }[]
    cta: string
  }

  if (!data) return null

  return (
    <section className="py-20 md:py-24 bg-surface border-b-2 border-border">
      <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        <div>
          <ScrollReveal>
            <h2 className="text-[28px] md:text-[36px] tracking-[-1.5px] leading-[1.15] text-heading mb-8">
              {data.title}
              <br />
              <em className="text-primary italic">{data.titleAccent}</em>
            </h2>
          </ScrollReveal>

          <div className="flex flex-col gap-4 mb-8">
            {data.pains.map((pain, i) => (
              <ScrollReveal key={i} delay={i * 120}>
                <motion.div
                  whileTap={{ y: 4, boxShadow: 'none' }}
                  className="flex items-center gap-3 bg-bg border-2 border-border rounded-lg px-5 py-4 shadow-card cursor-pointer transition-all duration-100"
                >
                  <div className="relative flex-shrink-0 w-8 h-8">
                    <span className="absolute inset-0 rounded-full bg-danger/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: `${i * 0.4}s` }} />
                    <span className="relative w-8 h-8 bg-danger/10 rounded-full flex items-center justify-center animate-pulse" style={{ animationDuration: '2.5s', animationDelay: `${i * 0.4}s` }}>
                      <Icon name={pain.icon} className="w-4 h-4 text-danger" />
                    </span>
                  </div>
                  <p className="text-sm text-text text-left">{pain.text}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={400}>
            <p className="text-[17px] text-muted leading-relaxed">{data.cta}</p>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <CharacterScene name="Glitch" color="#993556" />
        </ScrollReveal>
      </div>
    </section>
  )
}
