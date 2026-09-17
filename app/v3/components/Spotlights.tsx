'use client'

import { useEffect } from 'react'

/**
 * Spotlights — wires a cursor-tracking glow into every `.v3-spot` card
 * (Loop steps, department cards). On pointer move we write the local
 * x/y into CSS vars the card's ::after reads, so a soft light follows
 * the cursor across the card. Pointer-fine only.
 */
export default function Spotlights() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.v3-spot'))
    if (!cards.length) return

    const onMove = (e: PointerEvent) => {
      for (const c of cards) {
        const r = c.getBoundingClientRect()
        if (
          e.clientX >= r.left && e.clientX <= r.right &&
          e.clientY >= r.top && e.clientY <= r.bottom
        ) {
          c.style.setProperty('--mx', `${e.clientX - r.left}px`)
          c.style.setProperty('--my', `${e.clientY - r.top}px`)
        }
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return null
}
