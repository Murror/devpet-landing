'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
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

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')
  const toggleLocale = () => setLocale(l => l === 'en' ? 'vi' : 'en')
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
