'use client'

import { useState, type FormEvent } from 'react'
import { V4 } from '../content'

/**
 * WaitlistInline — the teaser's only interactive element.
 *
 * Posts to the existing /api/waitlist endpoint (Apps Script → Google
 * Sheet). A duplicate address is a success, not a failure: the person
 * is on the list either way. On error the entered address is kept so a
 * retry doesn't mean retyping it.
 *
 * Self-contained on purpose — the shared components/WaitlistForm.tsx is
 * bilingual (it reads the active locale from LocaleProvider, which IS
 * mounted at the root, to pick EN/VI copy and pass the right locale to
 * the API). This teaser is deliberately English-only and hardcodes
 * `locale: 'en'`, so it duplicates the small amount of form logic here
 * rather than pulling in a component built for two locales.
 */
type FormState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function WaitlistInline({ id = 'v4-email' }: { id?: string } = {}) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [invalid, setInvalid] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setInvalid(false)

    if (!EMAIL_RE.test(email)) {
      setInvalid(true)
      return
    }

    setState('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale: 'en' }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.status === 'duplicate') setState('duplicate')
      else if (res.ok) setState('success')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  if (state === 'success' || state === 'duplicate') {
    return (
      <p className="v4-done" role="status">
        {state === 'duplicate' ? V4.messages.duplicate : V4.messages.success}
      </p>
    )
  }

  return (
    <form className="v4-form" onSubmit={handleSubmit} noValidate>
      <label className="v4-sr" htmlFor={id}>Email address</label>
      <input
        id={id}
        type="email"
        className="v4-input"
        placeholder={V4.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-invalid={invalid || undefined}
      />
      <button type="submit" className="v4-btn" disabled={state === 'loading'}>
        {V4.ctaLabel}
      </button>
      {invalid && (
        <p className="v4-msg v4-msg--err" role="alert">{V4.messages.invalid}</p>
      )}
      {state === 'error' && (
        <p className="v4-msg v4-msg--err" role="alert">{V4.messages.error}</p>
      )}
    </form>
  )
}
