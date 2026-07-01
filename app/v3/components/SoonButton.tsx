'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'

/**
 * SoonButton — a CTA for the pre-launch web app. Instead of navigating
 * to a not-yet-live destination, clicking it reveals a small floating
 * "launching soon" note (same behaviour as the hero "Sign Up" button).
 * The note auto-dismisses after ~1s. Used for every "Open the web app"
 * CTA (nav + final section).
 */
export default function SoonButton({
  className = '',
  children,
  note = 'The web app will be launched soon',
}: {
  className?: string
  children: ReactNode
  note?: string
}) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  function reveal() {
    setOpen(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setOpen(false), 1800)
  }

  return (
    <span className="v3-soon-wrap">
      <button type="button" className={className} onClick={reveal}>
        {children}
      </button>
      {open && (
        <span className="v3-soon-note" role="status">
          {note}
        </span>
      )}
    </span>
  )
}
