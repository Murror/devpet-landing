'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import WaitlistForm from './WaitlistForm'
import ScrollReveal from './ScrollReveal'
import { Cat } from 'lucide-react'
import PetSlot from './PetSlot'

export default function FinalCTA() {
  const { t } = useLocale()

  return (
    <>
      <section id="final-cta" className="py-20 md:py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-[640px] px-6 text-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-14 h-14 bg-mint-light rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <motion.div
                animate={{ rotate: [0, -8, 8, -4, 0] }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
              >
                <Cat className="w-7 h-7 text-mint-dark" />
              </motion.div>
            </motion.div>
            <h2 className="text-3xl md:text-[42px] font-black tracking-[-1.5px] mb-4">
              {t.finalCTA.title}{' '}
              <em className="text-mint italic">{t.finalCTA.titleAccent}</em>
              {t.finalCTA.titleEnd}
            </h2>
            <p className="text-base text-muted leading-relaxed mb-8">{t.finalCTA.subtitle}</p>
            <div className="mb-4">
              <WaitlistForm />
            </div>
            <PetSlot section="finalCTA" className="hidden md:block mx-auto" />
            <p className="text-xs text-muted-light">{t.finalCTA.trustMeta}</p>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-extrabold">
            <span className="w-2 h-2 bg-mint rounded-full" />
            {t.footer.tagline}
          </div>
          <div className="flex gap-6">
            <a href="https://twitter.com/devpetapp" rel="noopener noreferrer" className="text-sm text-muted hover:text-text transition-colors">{t.footer.links.twitter}</a>
            <a href="https://github.com/devpet" rel="noopener noreferrer" className="text-sm text-muted hover:text-text transition-colors">{t.footer.links.github}</a>
            <a href="/privacy" className="text-sm text-muted hover:text-text transition-colors">{t.footer.links.privacy}</a>
          </div>
          <p className="text-xs text-muted-light">{t.footer.copyright}</p>
        </div>
      </footer>
    </>
  )
}
