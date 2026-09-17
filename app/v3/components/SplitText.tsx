'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

/**
 * SplitText — kinetic typography. Splits a heading into words that rise
 * and fade in sequence when the heading scrolls into view. Used for the
 * solid-colour section headings (lead + italic accent).
 */
export default function SplitText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { el.classList.add('is-in'); io.unobserve(el) }
      }),
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref} className={`v3-split ${className}`}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="v3-word" style={{ ['--wi']: i } as CSSProperties}>{w}</span>
      ))}
    </span>
  )
}
