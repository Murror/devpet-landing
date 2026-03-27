'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import Icon from './Icon'

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
    <section className="py-16 md:py-20 border-t border-border">
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <ScrollReveal>
          <h2 className="text-2xl md:text-[36px] font-black tracking-[-1.5px] leading-[1.15] mb-8">
            {data.title}
            <br />
            <em className="text-mint italic">{data.titleAccent}</em>
          </h2>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mb-8">
          {data.pains.map((pain, i) => (
            <ScrollReveal key={i} delay={i * 120}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 bg-card-bg border border-border rounded-lg px-5 py-4 shadow-card"
              >
                <div className="relative flex-shrink-0 w-8 h-8">
                  {/* Soft ping ring */}
                  <span
                    className="absolute inset-0 rounded-full bg-[#DC2626]/15 animate-ping"
                    style={{ animationDuration: '2.5s', animationDelay: `${i * 0.4}s` }}
                  />
                  {/* Core circle with gentle pulse */}
                  <span
                    className="relative w-8 h-8 bg-[#FEE2E2] rounded-full flex items-center justify-center animate-pulse"
                    style={{ animationDuration: '2.5s', animationDelay: `${i * 0.4}s` }}
                  >
                    <Icon name={pain.icon} className="w-4 h-4 text-[#DC2626]" />
                  </span>
                </div>
                <p className="text-sm font-semibold text-text text-left">{pain.text}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400}>
          <p className="text-base md:text-lg text-muted leading-relaxed">
            {data.cta}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
