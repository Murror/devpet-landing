'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import Link from 'next/link'
import Magnetic from './Magnetic'
import { HERO } from '../content'
import { useReleaseAvailable } from '@/lib/useReleaseAvailable'
import { DOWNLOAD_PAGE } from '@/lib/download'

/**
 * HeroCta — the hero call-to-action cluster while the web app is
 * pre-launch. The primary "Join the waitlist" button reveals an inline
 * email field that posts to the existing /api/waitlist backend (Google
 * Sheet); the secondary "Sign Up" links to the current web app (/app)
 * for early access. A note under the buttons sets expectations.
 *
 * v3 is English-only, so copy is inline (no LocaleProvider) and the
 * signup is tagged locale: 'en'.
 *
 * ONCE A BUILD IS PUBLISHED the cluster flips: "Download for macOS" becomes the primary and
 * the waitlist drops to the ghost slot. The waitlist is the right ask only while there is
 * nothing to hand over — asking someone to wait for a thing they could be using is the
 * worst version of this page. The flip needs no deploy; it follows the releases API.
 *
 * The "Sign Up" ghost button is what gets replaced, and it should be: it reveals a
 * "launching soon" note, which stops being true at exactly the same moment.
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
  // Shared with the nav and the /download page — one request per page load.
  const { released } = useReleaseAvailable()

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
              {released ? (
                <Link href={DOWNLOAD_PAGE} className="v3-btn v3-btn--primary">
                  Download for macOS
                </Link>
              ) : (
                <button
                  type="button"
                  className="v3-btn v3-btn--primary"
                  onClick={() => { setShowSoon(false); setOpen(true) }}
                >
                  {HERO.ctaPrimary}
                </button>
              )}
            </Magnetic>
            <Magnetic strength={0.25}>
              {released ? (
                /* The waitlist survives the flip rather than disappearing: someone on a
                   Windows machine, or without the prerequisites to hand, still has a way to
                   say "tell me more" instead of bouncing. */
                <button
                  type="button"
                  className="v3-btn v3-btn--ghost"
                  onClick={() => { setShowSoon(false); setOpen(true) }}
                >
                  {HERO.ctaPrimary}
                </button>
              ) : (
                <button
                  type="button"
                  className="v3-btn v3-btn--ghost"
                  onClick={revealSoon}
                >
                  {HERO.ctaSecondary}
                </button>
              )}
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
