'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'

/**
 * Magnetic — wraps an interactive element so it eases toward the
 * cursor while hovered, then springs back. A classic awwwards
 * micro-interaction. Disabled for coarse pointers / reduced motion.
 */
export default function Magnetic({
  children,
  strength = 0.4,
  className = '',
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  function onMove(e: MouseEvent) {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  function reset() {
    const el = ref.current
    if (el) el.style.transform = 'translate(0, 0)'
  }

  return (
    <span
      ref={ref}
      className={`v3-magnetic ${className}`}
      style={{ display: 'inline-flex' }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </span>
  )
}
