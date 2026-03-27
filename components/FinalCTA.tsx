'use client'

import { useLocale } from '@/lib/LocaleProvider'
import { motion } from 'framer-motion'
import WaitlistForm from './WaitlistForm'
import ScrollReveal from './ScrollReveal'
import CharacterSvg from './CharacterSvg'
import { getCharacterAnimation } from '@/lib/characterAnimations'

export default function FinalCTA() {
  const { t } = useLocale()

  return (
    <>
      <section id="final-cta" className="py-20 md:py-24">
        <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-12 items-center">
          <ScrollReveal>
            <div className="aspect-square rounded-2xl flex items-center justify-center max-w-[280px] mx-auto" style={{ backgroundColor: '#3B6D1115' }}>
              <motion.div animate={getCharacterAnimation('Null').animate} transition={getCharacterAnimation('Null').transition} className="w-[70%] h-[70%]">
                <CharacterSvg name="Null" className="w-full h-full" />
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div>
              <h2 className="text-[28px] md:text-[42px] tracking-[-1.5px] text-heading mb-4">
                {t.finalCTA.title}{' '}
                <em className="text-primary italic">{t.finalCTA.titleAccent}</em>
                {t.finalCTA.titleEnd}
              </h2>
              <p className="text-[17px] text-muted leading-relaxed mb-8">{t.finalCTA.subtitle}</p>
              <div className="mb-4">
                <WaitlistForm />
              </div>
              <p className="text-xs text-muted-light">{t.finalCTA.trustMeta}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t-2 border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-heading">
            <span className="w-2 h-2 bg-primary rounded-full" />
            {t.footer.tagline}
          </div>
          <div className="flex gap-6">
            <a href="https://twitter.com/devpetapp" rel="noopener noreferrer" className="text-sm text-muted hover:text-heading transition-colors">{t.footer.links.twitter}</a>
            <a href="https://github.com/devpet" rel="noopener noreferrer" className="text-sm text-muted hover:text-heading transition-colors">{t.footer.links.github}</a>
            <a href="/privacy" className="text-sm text-muted hover:text-heading transition-colors">{t.footer.links.privacy}</a>
          </div>
          <p className="text-xs text-muted-light">{t.footer.copyright}</p>
        </div>
      </footer>
    </>
  )
}
