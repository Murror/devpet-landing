'use client'

import { useState, type FormEvent } from 'react'
import type { Locale } from '@/lib/site'
import { blogStrings } from '@/lib/blog/ui-strings'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
type State = 'idle' | 'loading' | 'success' | 'duplicate' | 'error' | 'invalid'

/**
 * Newsletter subscribe band — a dark frosted panel lit from below by a
 * purple aura (matching the landing's final CTA). Reuses the site's
 * existing /api/waitlist endpoint ({ email, locale }) so signups land in
 * the same Google Sheet as the landing waitlist — no new backend.
 */
export default function NewsletterBand({ locale }: { locale: Locale }) {
  const s = blogStrings(locale)
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  const message =
    state === 'success'
      ? s.newsletterSuccess
      : state === 'duplicate'
        ? s.newsletterDuplicate
        : state === 'error'
          ? s.newsletterError
          : state === 'invalid'
            ? s.newsletterInvalid
            : ''
  const done = state === 'success' || state === 'duplicate'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!EMAIL_RE.test(email.trim())) {
      setState('invalid')
      return
    }
    setState('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), locale }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.status === 'duplicate') setState('duplicate')
      else if (res.ok) setState('success')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  return (
    <section className="bx-news" aria-label={s.newsletterTitle}>
      <div className="bx-news-inner">
        <div className="bx-news-copy">
          <h2 className="bx-news-title">{s.newsletterTitle}</h2>
          <p className="bx-news-body">{s.newsletterBody}</p>
        </div>
        <form className="bx-news-form" onSubmit={handleSubmit} noValidate>
          <div className="bx-news-field">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              className="bx-news-input"
              placeholder={s.newsletterPlaceholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (state !== 'idle' && state !== 'loading') setState('idle')
              }}
              aria-label={s.newsletterPlaceholder}
              disabled={done}
            />
            <button
              type="submit"
              className="bx-news-btn"
              disabled={state === 'loading' || done}
            >
              {state === 'loading' ? '…' : s.newsletterButton}
            </button>
          </div>
          {message && (
            <p
              className={`bx-news-msg${done ? ' is-ok' : ' is-err'}`}
              role="status"
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
