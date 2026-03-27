'use client'

import { useState, useEffect } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { Cat } from 'lucide-react'

export default function Nav() {
  const { t } = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={`sticky top-0 z-50 border-b bg-[rgba(250,255,254,0.85)] backdrop-blur-md transition-[border-color,box-shadow] duration-200
        ${scrolled ? 'border-border shadow-card' : 'border-transparent'}`}
    >
      <div className="mx-auto max-w-[1100px] px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-mint rounded-sm flex items-center justify-center"><Cat className="w-4 h-4 text-white" /></div>
          <span className="text-[17px] font-extrabold tracking-[-0.5px] text-text">VibeMon</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-7">
          {([{ label: t.nav.howItWorks, href: '#how-it-works' }, { label: t.nav.features, href: '#features' }, { label: t.meetYourPet.eyebrow, href: '#meet-your-pet' }]).map(link => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-muted hover:text-text transition-colors cursor-pointer">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: CTA + hamburger */}
        <div className="flex items-center gap-3">
          <a href="#hero" className="hidden sm:block bg-mint hover:bg-mint-dark text-white text-sm font-bold px-4 py-2 rounded-pill transition-[background-color] duration-150 ease-out">
            {t.nav.joinWaitlist}
          </a>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden text-muted hover:text-text text-xl transition-transform duration-150"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{ transform: menuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden border-t border-border bg-warm-bg px-6 py-4 flex flex-col gap-4 overflow-hidden"
          >
            {([{ label: t.nav.howItWorks, href: '#how-it-works' }, { label: t.nav.features, href: '#features' }, { label: t.meetYourPet.eyebrow, href: '#meet-your-pet' }]).map(link => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href="#hero" className="bg-mint text-white text-sm font-bold px-4 py-2 rounded-pill text-center" onClick={() => setMenuOpen(false)}>
              {t.nav.joinWaitlist}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
