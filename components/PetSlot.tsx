'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { useCompanion, SectionKey } from '@/lib/CompanionContext'

interface PetSlotProps {
  section: SectionKey
  className?: string
}

export default function PetSlot({ section, className }: PetSlotProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.5 })
  const { registerSlot, setActiveSection, characterName } = useCompanion()

  // Register position on mount and on resize
  useEffect(() => {
    if (!ref.current) return

    const updatePosition = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrollY = window.scrollY
      registerSlot(section, {
        top: rect.top + scrollY,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [section, registerSlot])

  // Set active section when in view
  useEffect(() => {
    if (isInView && characterName) {
      setActiveSection(section)
    }
  }, [isInView, section, setActiveSection, characterName])

  return (
    <div
      ref={ref}
      data-pet-slot={section}
      className={className}
      aria-hidden="true"
      style={{ width: 64, height: 64, pointerEvents: 'none' }}
    />
  )
}
