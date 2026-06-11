'use client'

import { ReactNode, useEffect } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import en from '@/lib/i18n/en.json'
import vi from '@/lib/i18n/vi.json'

/**
 * Wraps the v2 landing in a div whose class reflects the current
 * locale. The CSS variable + Upheaval TT overrides under
 * `.v2-root--vi` (see fonts.css) swap the entire pixel-font cascade
 * to DearPix when the user is on Vietnamese. English visits keep
 * `.v2-root` only and render with the original VT323 / Upheaval TT
 * stack — DearPix is never even loaded by the browser.
 *
 * Lives inside the (server-rendered) v2 layout because the layout
 * needs to export `metadata`, which a client component can't do.
 * This wrapper is the smallest client boundary that still lets us
 * read the locale.
 */
export default function LocaleClassWrapper({ children }: { children: ReactNode }) {
  const { locale } = useLocale()

  // Sync <title> / meta description / <html lang> to the active locale
  // for the LANDING only. Moved here from LocaleProvider so it doesn't
  // run on other routes (e.g. /blog, /privacy) and overwrite their own
  // per-route metadata after hydration. The server already rendered the
  // English landing metadata; this swaps it to Vietnamese for VN visits.
  useEffect(() => {
    const t = locale === 'vi' ? vi : en
    document.title = t.metadata.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t.metadata.description)
    document.documentElement.lang = locale === 'vi' ? 'vi' : 'en'
  }, [locale])

  const className = 'v2-root min-h-screen' + (locale === 'vi' ? ' v2-root--vi' : '')
  return <div className={className}>{children}</div>
}
