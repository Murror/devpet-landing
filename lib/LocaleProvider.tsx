'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from './i18n/en.json'
import vi from './i18n/vi.json'

type Locale = 'en' | 'vi'
type Messages = typeof en

interface LocaleContextValue {
  locale: Locale
  t: Messages
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const messages: Record<Locale, Messages> = { en, vi: vi as Messages }

// Client-side fallback for environments where the server-side
// `x-vercel-ip-country` header isn't available (local `next dev`,
// preview deploys hitting a region without geo, etc). When the
// server already passed an `initialLocale` derived from the header,
// this fetch is skipped — no extra request, no flash of English.
async function detectLocaleFromIP(): Promise<Locale> {
  try {
    const res = await fetch('https://api.country.is', { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return 'en'
    const data = await res.json()
    return data.country === 'VN' ? 'vi' : 'en'
  } catch {
    return 'en'
  }
}

interface LocaleProviderProps {
  children: ReactNode
  /**
   * Initial locale, computed server-side from Vercel's
   * `x-vercel-ip-country` header. The server already picked the
   * right language by the time the page hits the browser, so we
   * trust this value and skip the client-side IP fetch unless it
   * wasn't provided (local dev, etc).
   */
  initialLocale?: Locale
}

export function LocaleProvider({ children, initialLocale = 'en' }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale)

  useEffect(() => {
    // Migration: clear any pre-existing manual override from past
    // visits. Earlier builds persisted the toggle choice in
    // localStorage; per the new rule (IP detection always wins on
    // fresh visits), those keys are no longer respected and we
    // remove them so they can't influence anything else later.
    try {
      localStorage.removeItem('devpet-locale')
      localStorage.removeItem('devpet-locale-manual')
    } catch {
      // Private mode / storage disabled — nothing to clean up.
    }

    // If the server-side header already gave us 'vi', trust it and
    // skip the client-side fallback.
    if (initialLocale === 'vi') return

    // Otherwise (local dev, preview without geo, or non-VN country
    // defaulting to 'en'), do a client-side IP lookup as a
    // defensive fallback. Catches the edge case where Vercel's
    // header was missing but the visitor is actually in VN.
    detectLocaleFromIP().then((detected) => {
      if (detected !== locale) setLocale(detected)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // NB: syncing <title> / meta description / <html lang> to the locale
  // lives in LocaleClassWrapper (a landing-only client boundary), NOT
  // here. The provider sits in the root layout and wraps every route,
  // including /blog and /privacy — running the title overwrite here
  // would clobber those pages' own per-route <title> after hydration.

  const toggleLocale = () => {
    // Session-only toggle: flips the displayed language for the
    // current page view but does NOT persist anything. As soon as
    // the visitor refreshes or opens a new tab, IP-based detection
    // (server header + client fallback) takes over again. This is
    // the explicit product rule: a Vietnam IP always defaults to
    // Vietnamese, all other countries always default to English —
    // no past manual choice should override the country default
    // on a fresh visit.
    setLocale(prev => (prev === 'en' ? 'vi' : 'en'))
  }

  return (
    <LocaleContext.Provider value={{ locale, t: messages[locale], toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
