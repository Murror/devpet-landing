'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import ProfileSurvey from './ProfileSurvey'

/**
 * Final CTA — Section 9 of the /v2 landing.
 *
 * Black band matching the Framer "Waitlist" comp:
 *   - Two-line italic headline (white / grey)
 *   - #EEEEEE email pill, white submit pill
 *   - Outlined white "BACK TO TOP" pill
 *
 * Submissions POST to /api/waitlist, which forwards JSON to the
 * Google Apps Script web-app set in GOOGLE_SHEET_WEBHOOK_URL.
 * The script appends the email to the first sheet of its bound
 * spreadsheet and responds { result: "ok" } or { result: "duplicate" }.
 *
 * The form element has id="waitlist" so the existing
 * `href="#waitlist"` anchors from Mindset and Get Good scroll here.
 *
 * Locale is left as 'en' for now — wire to i18n if /v2 ever gets
 * translated.
 */

type FormState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function FinalCta() {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement | null>(null)
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [validationError, setValidationError] = useState(false)

  // Scroll-linked reveal — same pattern as SkillTrees / Testimonials,
  // but the Final CTA's Framer preset is "Slide In Top": elements
  // enter FROM ABOVE (Offset Y: -150), not from below. CSS handles
  // the direction via a dedicated `.v2-finalcta-reveal` class that
  // maps --scroll-progress to opacity + translateY(-150 → 0).
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const targets = Array.from(
      section.querySelectorAll<HTMLElement>('.v2-finalcta-reveal')
    )
    if (targets.length === 0) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) {
      for (const el of targets) el.style.setProperty('--scroll-progress', '1')
      return
    }

    let rafId: number | null = null

    const update = () => {
      rafId = null
      const vh = window.innerHeight
      // Entry ramp is 45% of the viewport — same pacing as the other
      // scroll-linked sections. Exit ramp is tighter (25%) and, more
      // importantly, is GATED so it only activates once the element's
      // top has actually scrolled past the viewport top (rect.top < 0).
      // Without this gate, an element sitting near the top of a 100vh
      // snap-aligned section (like the final CTA heading) was treated
      // as "exiting" even though it was still comfortably in view,
      // leaving it stuck at ~70% opacity (reading as lavender on the
      // purple band). Now exit stays at 1 while any part of the
      // element's top is still on-screen.
      const entryRamp = vh * 0.45
      const exitRamp = vh * 0.25
      for (const el of targets) {
        const rect = el.getBoundingClientRect()
        const entry = Math.max(0, Math.min(1, (vh - rect.top) / entryRamp))
        const exit =
          rect.top >= 0
            ? 1
            : Math.max(0, Math.min(1, rect.bottom / exitRamp))
        const progress = Math.min(entry, exit)
        el.style.setProperty('--scroll-progress', progress.toFixed(3))
      }
    }

    const schedule = () => {
      if (rafId === null) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setValidationError(false)

    if (!EMAIL_RE.test(email.trim())) {
      setValidationError(true)
      return
    }

    setState('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), locale: 'en' }),
      })
      const data = await res.json().catch(() => ({}))
      if (data.status === 'duplicate') {
        setState('duplicate')
      } else if (res.ok) {
        setState('success')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  const done = state === 'success' || state === 'duplicate'
  const loading = state === 'loading'
  // Progressive profiling — show the survey for both success and
  // duplicate states so returning visitors can also fill it. Survey
  // calls onComplete on skip or submit, then we drop into the
  // final thank-you state.
  const [surveyDone, setSurveyDone] = useState(false)
  const showSurvey = done && !surveyDone

  let buttonLabel = t.v2.form.submit
  if (loading) buttonLabel = t.v2.form.loading
  else if (state === 'success') buttonLabel = t.v2.form.success
  else if (state === 'duplicate') buttonLabel = t.v2.form.duplicate

  return (
    <section id="final-cta" ref={sectionRef} className="v2-finalcta">
      {/* Title + subtitle each render as ONE line on desktop and TWO
          lines on mobile. The wrapping span gets `display: block` only
          inside the mobile media query (see fonts.css), so the second
          half drops to a new line on small viewports without affecting
          the desktop layout. */}
      <h2 className="v2-finalcta-title v2-finalcta-reveal">
        {t.v2.finalCta.titleLine1}{' '}
        <span className="v2-finalcta-mobile-break">{t.v2.finalCta.titleLine2}</span>
      </h2>
      <p className="v2-finalcta-subtitle v2-finalcta-reveal">
        {t.v2.finalCta.subtitleLine1}{' '}
        <span className="v2-finalcta-mobile-break">{t.v2.finalCta.subtitleLine2}</span>
      </p>

      {showSurvey ? (
        <div id="waitlist">
          <ProfileSurvey
            email={email}
            variant="dark"
            onComplete={() => setSurveyDone(true)}
          />
        </div>
      ) : (
      <form
        id="waitlist"
        className={
          'v2-finalcta-form v2-finalcta-reveal' +
          (done ? ' v2-finalcta-form--done' : '')
        }
        onSubmit={handleSubmit}
        noValidate
      >
        {/* Hide the email input once they're in (success or duplicate).
            See Product.tsx for the same pattern + rationale. */}
        {!done && (
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={t.v2.form.placeholder}
            className={
              'v2-finalcta-input' +
              (validationError ? ' v2-finalcta-input--error' : '')
            }
            aria-label={t.v2.form.emailAria}
            aria-invalid={validationError || state === 'error'}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (validationError) setValidationError(false)
              if (state === 'error') setState('idle')
            }}
            disabled={loading}
          />
        )}
        <button
          type="submit"
          className={
            'v2-finalcta-submit' +
            (done ? ' v2-finalcta-submit--done' : '')
          }
          disabled={loading || done}
        >
          {buttonLabel}
        </button>

        {done && (
          <p
            className="v2-finalcta-msg v2-finalcta-msg--success"
            aria-live="polite"
          >
            {t.v2.form.successSubtitle}
          </p>
        )}

        {validationError && (
          <p className="v2-finalcta-msg v2-finalcta-msg--error" role="alert">
            {t.v2.form.errorValidation}
          </p>
        )}
        {state === 'error' && !validationError && (
          <p className="v2-finalcta-msg v2-finalcta-msg--error" role="alert">
            {t.v2.form.errorServer}
          </p>
        )}
      </form>
      )}
    </section>
  )
}
