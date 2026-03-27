'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import WaitlistForm from './WaitlistForm'

export default function MidCTA() {
  const { t } = useLocale()

  return (
    <section className="py-16 bg-primary">
      <ScrollReveal>
        <div className="mx-auto max-w-[560px] px-6 text-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[28px] md:text-[32px] tracking-[-1px] text-white mb-2"
          >
            {t.midCTA.title}
          </motion.p>
          <p className="text-sm text-white/80 mb-6">{t.midCTA.subtitle}</p>
          <WaitlistForm />
        </div>
      </ScrollReveal>
    </section>
  )
}
