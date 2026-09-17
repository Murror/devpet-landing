'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import Magnetic from './Magnetic'
import { HERO } from '../content'

/**
 * HeroCta — the hero call-to-action cluster while the web app is
 * pre-launch. The primary "Join the waitlist" button reveals an inline
 * email field that posts to the existing /api/waitlist backend (Google
 * Sheet); the secondary "Sign Up" links to the current web app (/app)
 * for early access. A note under the buttons sets expectations.
 *
 * v3 is English-only, so copy is inline (no LocaleProvider) and the
 * signup is tagged locale: 'en'.
 */

type FormState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function HeroCta() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  // The web app isn't live yet, so "Sign Up" reveals a "launching soon"
  // note instead of navigating anywhere. The note auto-dismisses after ~1s.
  const [showSoon, setShowSoon] = useState(false)
  const soonTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (soonTimer.current) clearTimeout(soonTimer.current) }, [])

  function revealSoon() {
    setShowSoon(true)
    if (soonTimer.current) clearTimeout(soonTimer.current)
    soonTimer.current = setTimeout(() => setShowSoon(false), 1800)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setState('error')
      return
    }
    setState('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale: 'en' }),
      })
      const data = await res.json()
      if (data.status === 'duplicate') setState('duplicate')
      else if (res.ok) setState('success')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  const done = state === 'success' || state === 'duplicate'

  return (
    <div className="v3-hero-cta-wrap">
      <div className="v3-hero-cta">
        {done ? (
          <p className="v3-waitlist-msg" role="status">
            {state === 'success'
              ? 'You’re on the list — we’ll email you the moment it launches.'
              : 'You’re already on the list — hang tight.'}
          </p>
        ) : !open ? (
          <>
            <Magnetic>
              <button
                type="button"
                className="v3-btn v3-btn--primary"
                onClick={() => { setShowSoon(false); setOpen(true) }}
              >
                {HERO.ctaPrimary}
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                type="button"
                className="v3-btn v3-btn--ghost"
                onClick={revealSoon}
              >
                {HERO.ctaSecondary}
              </button>
            </Magnetic>
          </>
        ) : (
          <form className="v3-waitlist" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              className={`v3-waitlist-input${state === 'error' ? ' is-invalid' : ''}`}
              placeholder="you@email.com"
              value={email}
              autoFocus
              aria-label="Email address"
              disabled={state === 'loading'}
              onChange={(e) => {
                setEmail(e.target.value)
                if (state === 'error') setState('idle')
              }}
            />
            <button
              type="submit"
              className="v3-btn v3-btn--primary"
              disabled={state === 'loading'}
            >
              {state === 'loading' ? 'Joining…' : 'Join'}
            </button>
          </form>
        )}
      </div>

      {state === 'error' && (
        <p className="v3-waitlist-err" role="alert">
          Please enter a valid email and try again.
        </p>
      )}
      {showSoon && !open && !done && (
        <p className="v3-hero-cta-note" role="status">{HERO.ctaNote}</p>
      )}
    </div>
  )
}
