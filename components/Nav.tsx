'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { Cat } from 'lucide-react'

export default function Nav() {
  const { t } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-[rgba(250,248,244,0.85)] backdrop-blur-md">
      <div className="mx-auto max-w-[1100px] px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-mint rounded-sm flex items-center justify-center"><Cat className="w-4 h-4 text-white" /></div>
          <span className="text-[17px] font-extrabold tracking-[-0.5px] text-text">DevPet</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-7">
          {([{ label: t.nav.howItWorks, href: '#how-it-works' }, { label: t.nav.features, href: '#features' }, { label: t.meetYourPet.eyebrow, href: '#meet-your-pet' }]).map(link => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-muted hover:text-text transition-colors cursor-pointer">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: lang toggle + CTA + hamburger */}
        <div className="flex items-center gap-3">
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
          {([{ label: t.nav.howItWorks, href: '#how-it-works' }, { label: t.nav.features, href: '#features' }, { label: t.meetYourPet.eyebrow, href: '#meet-your-pet' }]).map(link => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-muted" onClick={() => setMenuOpen(false)}>
              {link.label}
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
