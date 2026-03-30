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
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`sticky top-0 z-50 bg-bg/80 backdrop-blur-lg border-b transition-[border-color] duration-200
        ${scrolled ? 'border-border/50' : 'border-transparent'}`}
    >
      <div className="mx-auto max-w-[1100px] px-6 h-[60px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center"><Cat className="w-4 h-4 text-white" /></div>
          <span className="text-[17px] text-heading">CodePet</span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-7">
          {([{ label: t.nav.howItWorks, href: '#how-it-works' }, { label: t.nav.features, href: '#features' }, { label: t.meetYourPet.eyebrow, href: '#meet-your-pet' }]).map(link => (
            <a key={link.href} href={link.href} className="text-sm text-muted hover:text-heading transition-colors cursor-pointer">
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: CTA + hamburger */}
        <div className="flex items-center gap-3">
          <motion.a
            href="#hero"
            whileTap={{ scale: 0.97 }}
            className="hidden sm:block bg-primary text-white text-[13px] uppercase tracking-[1px] px-5 py-2 rounded-lg shadow-btn transition-all duration-100"
          >
            {t.nav.joinWaitlist}
          </motion.a>

          {/* Hamburger (mobile) */}
          <button
            className="md:hidden text-muted hover:text-heading text-xl w-10 h-10 flex items-center justify-center transition-transform duration-150"
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
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="md:hidden border-t border-border/50 bg-bg/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-4 overflow-hidden"
          >
            {([{ label: t.nav.howItWorks, href: '#how-it-works' }, { label: t.nav.features, href: '#features' }, { label: t.meetYourPet.eyebrow, href: '#meet-your-pet' }]).map(link => (
              <a key={link.href} href={link.href} className="text-sm text-muted py-2" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <motion.a
              href="#hero"
              whileTap={{ scale: 0.97 }}
              className="bg-primary text-white text-[13px] uppercase tracking-[1px] px-5 py-2.5 rounded-lg shadow-btn text-center"
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.joinWaitlist}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
