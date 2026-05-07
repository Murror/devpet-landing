'use client'

import Image from 'next/image'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import ProfileSurvey from './ProfileSurvey'

/**
 * Product — Section 3 of the /v2 landing.
 *
 * Redesign matches the Framer "Product" comp at 1440 Desktop:
 *
 *   ┌───────────────────────────────────────────────────────────┐
 *   │ PRODUCT                                                   │
 *   │                                                           │
 *   │ codepet        ·  agentic coding                          │
 *   │                                                                ✦
 *   │ who we are                                        ╭──────╮     ·
 *   │                                                   │      │   ✦
 *   │ Codepet is a macOS application that helps         │ BYTE │
 *   │ people develop their thinking and                 │      │   ✦
 *   │ *ship products of their own*. Guided agentic      ╰──────╯
 *   │ coding, adaptive feedback, and a daily-practice         ✦
 *   │ loop turn early exposure to programming into
 *   │ durable skill.
 *   │
 *   │ Integrates with:
 *   │ Cursor     VS code     Windsurf
 *   │
 *   │ [ email@example.com         ]  [ Join the waitlist ]
 *   └───────────────────────────────────────────────────────────┘
 *
 * The form posts to /api/waitlist just like FinalCta — same endpoint,
 * same duplicate/error handling. We duplicate the small piece of
 * state here so both CTAs can live on the page with independent
 * status messages.
 *
 * The right column is presentational — a big purple Byte character
 * sprite with a few pixel-art coins scattered around him.
 */

type FormState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Product() {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [validationError, setValidationError] = useState(false)
  const sectionRef = useRef<HTMLElement | null>(null)

  // Scroll-linked enter animation (per Framer spec):
  //   Trigger   : Section in View
  //   Replay    : Yes
  //   Enter/Exit: opacity 0, scale 0.5 → opacity 1, scale 1
  //   Transition: Spring (stiffness 200, damping 35, mass 1)
  //
  // We write a normalised progress value `--enter-p` (0..1) to the
  // section root; CSS on `.v2-product-inner` uses it to interpolate
  // opacity + scale. The reveal is distributed across ~60% of a
  // viewport of scroll so the motion feels deliberate rather than
  // snapping in — matching the slow feel the Mindset section uses.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let ticking = false
    const update = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // 0 when section top is at viewport bottom, 1 once the top
      // has risen by a full viewport of scroll. Stretching the
      // curve across 1.0 × viewport (was 0.6) distributes the reveal
      // over more scroll distance so it feels slower and more
      // deliberate — matches the "slow reveal" the user asked for.
      const raw = (vh - rect.top) / (vh * 1.0)
      const clamped = Math.max(0, Math.min(1, raw))
      section.style.setProperty('--enter-p', clamped.toFixed(4))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
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
  // Progressive profiling — once the user reaches "done" (either a
  // fresh signup OR a duplicate-already-in-list), swap the form to
  // the optional survey. Returning visitors who already submitted
  // an email get a chance to add profile info too. The survey
  // calls onComplete on either skip or submit, then we drop into
  // the final thank-you message below.
  const [surveyDone, setSurveyDone] = useState(false)
  const showSurvey = done && !surveyDone

  // Auto-reset the form ~2 s after the user reaches a terminal
  // confirmation pill (either fresh signup or already-on-list).
  // The visitor reads the message, then the form becomes reusable
  // so they can submit another email. Fires only after the survey
  // step is finished so the modal isn't still on-screen when the
  // reset happens. Cleans up if the component unmounts mid-timer.
  useEffect(() => {
    if (!done || !surveyDone) return
    const timer = setTimeout(() => {
      setState('idle')
      setEmail('')
      setSurveyDone(false)
    }, 6000)
    return () => clearTimeout(timer)
  }, [done, surveyDone])

  let buttonLabel = t.v2.form.submit
  if (loading) buttonLabel = t.v2.form.loading
  else if (state === 'success') buttonLabel = t.v2.form.success
  else if (state === 'duplicate') buttonLabel = t.v2.form.duplicate

  return (
    <section id="product" ref={sectionRef} className="v2-product">
      <div className="v2-product-inner">
        {/* ── Left column: copy + waitlist input ── */}
        <div className="v2-product-left">
          <p className="v2-product-eyebrow">{t.v2.product.eyebrow}</p>

          <h3 className="v2-product-heading">{t.v2.product.heading}</h3>

          <p className="v2-product-body">
            {t.v2.product.bodyLead} <em>{t.v2.product.bodyEm}</em>
            {t.v2.product.bodyTrail}
          </p>

          <p className="v2-product-integrates">{t.v2.product.integratesWith}</p>
          <ul className="v2-product-integrations" aria-label={t.v2.product.integrationsAria}>
            <li>
              <Image
                src="/v2/integrations/cursor.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
              <span>{t.v2.product.integrationCursor}</span>
            </li>
            <li>
              <Image
                src="/v2/integrations/vscode.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
              <span>{t.v2.product.integrationVscode}</span>
            </li>
            <li>
              <Image
                src="/v2/integrations/windsurf.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
              <span>{t.v2.product.integrationWindsurf}</span>
            </li>
          </ul>

          {showSurvey ? (
            <ProfileSurvey
              email={email}
              variant="light"
              onComplete={() => setSurveyDone(true)}
            />
          ) : (
          <form
            className={
              'v2-product-form' + (done ? ' v2-product-form--done' : '')
            }
            onSubmit={handleSubmit}
            noValidate
            aria-label={t.v2.form.waitlistAria}
          >
            {/* Hide the email input once the user has successfully joined
                (success or duplicate). The pixel-pill button below carries
                the confirmation copy on its own — leaving the disabled
                input visible just clutters the success state. */}
            {!done && (
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder={t.v2.form.placeholder}
                className={
                  'v2-product-input' +
                  (validationError ? ' v2-product-input--error' : '')
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
                'v2-product-submit' +
                (done ? ' v2-product-submit--done' : '')
              }
              disabled={loading || done}
            >
              {/* Inner span carries the clip-path + body colour;
                  outer button gets the drop-shadow black outline.
                  Same pattern as the nav CTA — splits so the clip
                  doesn't crop the outline filter. The --done modifier
                  cancels the disabled-state dimming so the success
                  pill keeps its full pixel-art colour. */}
              <span className="v2-product-submit-body">{buttonLabel}</span>
            </button>

            {/* Subtitle that appears once they're in — gives the success
                state context (when to expect to hear from us) so the
                button isn't a dead end. aria-live so screen readers
                announce it on success. */}
            {done && (
              <p className="v2-product-msg v2-product-msg--success" aria-live="polite">
                {t.v2.form.successSubtitle}
              </p>
            )}

            {validationError && (
              <p
                className="v2-product-msg v2-product-msg--error"
                role="alert"
              >
                {t.v2.form.errorValidation}
              </p>
            )}
            {state === 'error' && !validationError && (
              <p
                className="v2-product-msg v2-product-msg--error"
                role="alert"
              >
                {t.v2.form.errorServer}
              </p>
            )}
          </form>
          )}
        </div>

        {/* ── Right column: Byte character + scattered coins ── */}
        <div className="v2-product-right" aria-hidden="true">
          <Image
            src="/v2/pets/4-purple-byte.png"
            alt=""
            width={960}
            height={1408}
            className="v2-product-byte"
            unoptimized
            priority={false}
          />
          <Image
            src="/v2/coin.png"
            alt=""
            width={413}
            height={449}
            className="v2-product-coin v2-product-coin--1"
            unoptimized
          />
          <Image
            src="/v2/coin.png"
            alt=""
            width={413}
            height={449}
            className="v2-product-coin v2-product-coin--2"
            unoptimized
          />
        </div>
      </div>
    </section>
  )
}
