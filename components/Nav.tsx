'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

export default function Nav() {
  const { t, locale, toggleLocale } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-[rgba(250,248,244,0.85)] backdrop-blur-md">
      <div className="mx-auto max-w-[1100px] px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-mint rounded-sm flex items-center justify-center text-base">😺</div>
          <span className="text-[17px] font-extrabold tracking-[-0.5px] text-text">DevPet</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-7">
          {[t.nav.features, t.nav.howItWorks, t.nav.pricing].map(link => (
            <a key={link} href="#" className="text-sm font-medium text-muted hover:text-text transition-colors cursor-pointer">
              {link}
            </a>
          ))}
        </div>

        {/* Right: lang toggle + CTA + hamburger */}
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <div className="bg-border rounded-pill p-0.5 flex gap-0.5">
            {(['en', 'vi'] as const).map(l => (
              <button
                key={l}
                onClick={() => { if (locale !== l) toggleLocale() }}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-pill transition-all ${
                  locale === l
                    ? 'bg-card-bg text-text shadow-card'
                    : 'text-muted bg-transparent'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* CTA */}
          <a href="#waitlist" className="hidden sm:block bg-mint hover:bg-mint-dark text-white text-sm font-bold px-4 py-2 rounded-pill transition-colors">
            {t.nav.joinWaitlist}
          </a>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden text-muted hover:text-text text-xl"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-warm-bg px-6 py-4 flex flex-col gap-4">
          {[t.nav.features, t.nav.howItWorks, t.nav.pricing].map(link => (
            <a key={link} href="#" className="text-sm font-medium text-muted" onClick={() => setMenuOpen(false)}>
              {link}
            </a>
          ))}
          <a href="#waitlist" className="bg-mint text-white text-sm font-bold px-4 py-2 rounded-pill text-center" onClick={() => setMenuOpen(false)}>
            {t.nav.joinWaitlist}
          </a>
        </div>
      )}
    </nav>
  )
}
