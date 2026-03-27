'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type SectionKey = 'hero' | 'howItWorks' | 'features' | 'skillTree' | 'testimonials' | 'finalCTA'

interface CompanionState {
  characterName: string | null
  pick: (name: string) => void
  activeSection: SectionKey | null
  setActiveSection: (section: SectionKey) => void
  isMobile: boolean
  pickerDismissed: boolean
  dismissPicker: () => void
}

const CompanionCtx = createContext<CompanionState>({
  characterName: null,
  pick: () => {},
  activeSection: null,
  setActiveSection: () => {},
  isMobile: false,
  pickerDismissed: false,
  dismissPicker: () => {},
})

export function CompanionProvider({ children }: { children: ReactNode }) {
  const [characterName, setCharacterName] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [pickerDismissed, setPickerDismissed] = useState(false)
  const dismissPicker = () => setPickerDismissed(true)

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)')
    setIsMobile(!mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return (
    <CompanionCtx.Provider value={{
      characterName,
      pick: setCharacterName,
      activeSection,
      setActiveSection,
      isMobile,
      pickerDismissed,
      dismissPicker,
    }}>
      {children}
    </CompanionCtx.Provider>
  )
}

export function useCompanion() {
  return useContext(CompanionCtx)
}

export type { SectionKey }
