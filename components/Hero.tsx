'use client'

import { useLocale } from '@/lib/LocaleProvider'
import WaitlistForm from './WaitlistForm'
import AppWindowMockup from './AppWindowMockup'

export default function Hero() {
  const { t } = useLocale()

  return (
    <section id="waitlist" className="mx-auto max-w-[1100px] px-6 py-16 md:py-20 grid md:grid-cols-[1fr_1.1fr] gap-16 items-center">
      <div>
        <div className="inline-flex items-center gap-1.5 bg-mint-light border border-[#B8F0DD] rounded-pill px-3 py-1.5 text-xs font-semibold text-mint-dark mb-6">
          <span className="w-1.5 h-1.5 bg-mint rounded-full" />
          {t.hero.badge}
        </div>
        <h1 className="text-4xl md:text-[52px] font-black leading-[1.1] tracking-[-2px] mb-5">
          {t.hero.title}{' '}
          <em className="text-mint italic">{t.hero.titleAccent}</em>
        </h1>
        <p className="text-base md:text-[17px] text-muted leading-[1.7] max-w-[400px] mb-8">
          {t.hero.subtitle}
        </p>
        <div className="mb-4">
          <WaitlistForm />
        </div>
        <p className="text-xs text-muted-light">{t.hero.trustMeta}</p>
      </div>
      <AppWindowMockup />
    </section>
  )
}
