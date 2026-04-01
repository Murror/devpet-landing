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

async function detectLocale(): Promise<Locale> {
  try {
    const res = await fetch('https://api.country.is', { signal: AbortSignal.timeout(3000) })
    if (!res.ok) return 'en'
    const data = await res.json()
    return data.country === 'VN' ? 'vi' : 'en'
  } catch {
    return 'en'
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    const manual = localStorage.getItem('devpet-locale-manual')
    const saved = localStorage.getItem('devpet-locale') as Locale | null
    if (manual && saved) {
      setLocale(saved)
    } else {
      detectLocale().then(setLocale)
    }
  }, [])

  useEffect(() => {
    const t = messages[locale]
    document.title = t.metadata.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.metadata.description)
    document.documentElement.lang = locale === 'vi' ? 'vi' : 'en'
  }, [locale])

  const toggleLocale = () => {
    setLocale(prev => {
      const next = prev === 'en' ? 'vi' : 'en'
      localStorage.setItem('devpet-locale', next)
      localStorage.setItem('devpet-locale-manual', '1')
      return next
    })
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
