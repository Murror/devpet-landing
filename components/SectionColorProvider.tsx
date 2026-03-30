'use client'

import { useEffect, useState } from 'react'

/**
 * Observes sections with data-section-color and transitions
 * the page background to a light tint of that color on scroll.
 */
export default function SectionColorProvider() {
  const [bgColor, setBgColor] = useState('#FFFFFF')

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-section-color]')
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let best: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
            best = entry
          }
        }
        if (best) {
          const color = (best.target as HTMLElement).dataset.sectionColor || ''
          setBgColor(color || '#FFFFFF')
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6], rootMargin: '-40% 0px -40% 0px' }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.transition = 'background-color 0.6s ease'
    document.body.style.backgroundColor = bgColor
    return () => {
      document.body.style.backgroundColor = ''
      document.body.style.transition = ''
    }
  }, [bgColor])

  return null
}
