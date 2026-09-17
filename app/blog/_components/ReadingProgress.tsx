'use client'

import { useEffect, useRef } from 'react'

/**
 * ReadingProgress — a slim purple bar fixed under the nav that fills as
 * the reader scrolls the article. Drives a CSS `transform: scaleX()` via
 * a `--p` custom property (0 → 1), updated on scroll through rAF so it
 * never thrashes layout. Purely decorative — hidden from assistive tech.
 */
export default function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const update = () => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const p = max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0
      el.style.setProperty('--p', String(p))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="bx-progress" aria-hidden="true" />
}
