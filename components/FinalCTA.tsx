'use client'

import { useLocale } from '@/lib/LocaleProvider'
import WaitlistForm from './WaitlistForm'
import ScrollReveal from './ScrollReveal'
import CharacterScene from './CharacterScene'
import Image from 'next/image'

export default function FinalCTA() {
  const { t } = useLocale()

  return (
    <>
      <section id="final-cta" data-section-color="#F0F7EC" className="py-20 md:py-24">
        <div className="mx-auto max-w-[1100px] px-6 grid md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-12 items-center">
          <ScrollReveal className="hidden md:block">
            <CharacterScene name="Null" color="#3B6D11" />
          </ScrollReveal>

          <ScrollReveal>
            <div>
              <h2 className="text-[28px] md:text-[42px] tracking-[-1.5px] text-heading mb-4">
                {t.finalCTA.title}{' '}
                <em className="text-primary italic">{t.finalCTA.titleAccent}</em>
                {t.finalCTA.titleEnd}
              </h2>
              <p className="hidden md:block text-[17px] text-muted leading-relaxed mb-8">{t.finalCTA.subtitle}</p>
              <div className="mb-4">
                <WaitlistForm />
              </div>
              <p className="text-xs text-muted-light">{t.finalCTA.trustMeta}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-[1100px] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/logo.jpg" alt={t.footer.tagline} width={120} height={40} className="h-8 w-auto" />
          <p className="text-xs text-muted-light">{t.footer.copyright}</p>
        </div>
      </footer>
    </>
  )
}
