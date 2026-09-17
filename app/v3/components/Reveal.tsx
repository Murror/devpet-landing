'use client'

import { useEffect, useRef, ReactNode } from 'react'

/**
 * Reveal — fades + lifts children into view on first scroll.
 * Progressive enhancement: the `.v3-reveal` base style hides the
 * content; once observed we add `.is-in`. Reduced-motion users get
 * the content immediately (handled in CSS). Always a <div> wrapper —
 * keeps ref typing simple and layout-neutral.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('is-in')
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`v3-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
