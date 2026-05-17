'use client'

import Image from 'next/image'
import { FormEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * ProfileSurvey — Optional 5-field survey rendered as a popup modal
 * after a successful email submit on either the Product or FinalCta
 * forms.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────────────┐
 *   │  ┌─────────┐  ┌──────────────────────────┐         X │
 *   │  │  Byte   │  │  Banner                  │           │
 *   │  │  on     │  │  Field 1                 │           │
 *   │  │ purple  │  │  Field 2 …               │           │
 *   │  │ band    │  │  Skip │ Submit           │           │
 *   │  └─────────┘  └──────────────────────────┘           │
 *   └──────────────────────────────────────────────────────┘
 *
 * Modal mechanics:
 *   - Fixed full-screen backdrop (semi-transparent dark)
 *   - Centered card with 2-column layout (image | form)
 *   - X close button → onComplete (treated as skip)
 *   - ESC key → onComplete (skip)
 *   - Click on backdrop → onComplete (skip)
 *   - Body scroll locked while open
 *   - On mobile (< 720), the columns stack vertically
 *
 * For preview/test the submit posts to /api/waitlist/profile. If the
 * env webhook isn't set the route logs the payload and returns ok.
 */

type SurveyState = 'idle' | 'submitting' | 'error' | 'mustComplete'

type SignupFor = 'self' | 'family'

type Props = {
  email: string
  /** Carried through for backwards-compat; modal styling is fixed
   *  and the variant prop is no longer used by the layout. */
  variant?: 'light' | 'dark'
  onComplete: () => void
}

export default function ProfileSurvey({ email, onComplete }: Props) {
  const { t } = useLocale()
  const survey = t.v2.survey
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [source, setSource] = useState('')
  const [sourceOther, setSourceOther] = useState('')
  const [signupFor, setSignupFor] = useState<SignupFor>('self')
  const [familyAge, setFamilyAge] = useState('')
  const [computer, setComputer] = useState('')
  const [computerOther, setComputerOther] = useState('')
  const [needs, setNeeds] = useState('')
  const [state, setState] = useState<SurveyState>('idle')

  // Track when the component is mounted so we can render via
  // createPortal to document.body. createPortal escapes the form's
  // ancestor chain — critical because the parent sections
  // (.v2-product-inner, .v2-finalcta-reveal) carry CSS transforms
  // that would otherwise re-anchor `position: fixed` to that
  // transformed box instead of the viewport, leaving the modal
  // partially visible inside the section.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Green success banner auto-dismisses 1 s after the modal opens.
  // The survey is now required, so we don't want the
  // congratulations message to compete with the form copy for
  // long — flashing it briefly is enough confirmation that the
  // email was accepted before we hand attention to the fields.
  const [bannerVisible, setBannerVisible] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setBannerVisible(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const submitting = state === 'submitting'
  const submitLabel = submitting ? survey.submitting : survey.submit

  // Lock body scroll while the modal is open + close on ESC.
  // iOS Safari doesn't honour `overflow: hidden` on body to
  // prevent scrolling — the URL-bar collapse + overscroll bounce
  // still let the page move underneath the modal. The reliable
  // cross-browser fix is to pin the body to its current scroll
  // position with `position: fixed; top: -scrollY` and restore
  // when the modal closes. Works on desktop, Android Chrome,
  // iOS Safari, and Safari on iPad.
  useEffect(() => {
    const scrollY = window.scrollY
    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      overflow: document.body.style.overflow,
      width: document.body.style.width,
    }
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    // ESC no longer exits — the survey is required, so we surface
    // the same "must complete" warning the X button + backdrop
    // click do. Visitors complete by hitting Submit; there is no
    // bail-out path.
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !submitting) {
        e.preventDefault()
        triggerMustComplete()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.position = prev.position
      document.body.style.top = prev.top
      document.body.style.left = prev.left
      document.body.style.right = prev.right
      document.body.style.width = prev.width
      document.body.style.overflow = prev.overflow
      // Restore the scroll position the user was at before the
      // modal opened — without this they jump to the top.
      window.scrollTo(0, scrollY)
      window.removeEventListener('keydown', onKey)
    }
  }, [onComplete, submitting])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    try {
      const res = await fetch('/api/waitlist/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          age: age || undefined,
          gender: gender || undefined,
          source: source || undefined,
          sourceOther: source === 'Other' || source === 'Khác' ? sourceOther : undefined,
          signupFor,
          familyAge: signupFor === 'family' ? familyAge || undefined : undefined,
          computer: computer || undefined,
          // Free-text only carried when the user picked the trailing
          // "Other / Loại khác" option from the computer toggles.
          computerOther:
            computer === 'Other' || computer === 'Loại khác'
              ? computerOther || undefined
              : undefined,
          needs: needs.trim() || undefined,
        }),
      })
      if (!res.ok) throw new Error('profile post failed')
      onComplete()
    } catch {
      setState('error')
    }
  }

  // Trying to dismiss without submitting → flash a warning. The
  // form is required (no skip path), so X / backdrop click / ESC
  // all route here. Auto-clears after 3 s so a previously-shown
  // warning doesn't linger if the visitor goes back to filling
  // the form.
  function triggerMustComplete() {
    if (submitting) return
    setState('mustComplete')
    setTimeout(() => {
      setState((prev) => (prev === 'mustComplete' ? 'idle' : prev))
    }, 3000)
  }

  // Source "Other" is the LAST option in both vi.json and en.json.
  const otherOption = survey.sourceOptions[survey.sourceOptions.length - 1]
  const showSourceOther = source === otherOption

  const fam = signupFor === 'family'

  // Backdrop click no longer dismisses — same gate as the X
  // button. Stop propagation on the modal panel so clicks inside
  // the form don't bubble up and trigger the warning.
  function onBackdropClick() {
    triggerMustComplete()
  }

  // Don't render anything during SSR — portal target (document.body)
  // doesn't exist on the server, and we want a clean mount.
  if (!mounted) return null

  const overlay = (
    <div
      className="v2-survey-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={survey.title}
      onClick={onBackdropClick}
    >
      <div className="v2-survey-modal" onClick={(e) => e.stopPropagation()}>
        {/* X close button — pinned to the modal's top-right corner so
            it sits at the outer edge of the panel regardless of which
            column it falls over (image on mobile, form on desktop).
            The survey is required, so this still routes through
            triggerMustComplete instead of dismissing. */}
        <button
          type="button"
          className="v2-survey-close"
          aria-label={survey.errorMustComplete}
          onClick={triggerMustComplete}
          disabled={submitting}
        >
          <span aria-hidden="true">×</span>
        </button>

        {/* ── Left column: animated forest scene ─────────────────────
            Forest backdrop with three companions strolling across the
            grass on a continuous loop. Background image lives at
            /public/v2/survey/forest-bg.png — if missing, the CSS
            fallback gradient sky still reads as a calm scene.
            Each character has its own walk loop with a different
            duration + delay so they don't move in lockstep. */}
        <div className="v2-survey-image" aria-hidden="true">
          <div className="v2-survey-scene">
            <div className="v2-survey-scene-bg" />
            <div className="v2-survey-walker v2-survey-walker--fox">
              <Image
                src="/v2/pets/3-orange-fox.png"
                alt=""
                width={170}
                height={220}
                unoptimized
              />
            </div>
            <div className="v2-survey-walker v2-survey-walker--byte">
              <Image
                src="/v2/pets/4-purple-byte.png"
                alt=""
                width={170}
                height={220}
                unoptimized
              />
            </div>
            <div className="v2-survey-walker v2-survey-walker--penguin">
              <Image
                src="/v2/pets/7-blue-penguin.png"
                alt=""
                width={170}
                height={220}
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* ── Right column: form ─────────────────────────────────── */}
        <div className="v2-survey-pane">
          {bannerVisible && (
            <div className="v2-survey-banner">
              <span className="v2-survey-tick" aria-hidden="true">✓</span>
              <div>
                <p className="v2-survey-banner-title">{survey.title}</p>
                <p className="v2-survey-banner-subtitle">{survey.subtitle}</p>
              </div>
            </div>
          )}

          <form className="v2-survey-form" onSubmit={handleSubmit}>
            <div className="v2-survey-field">
              <label className="v2-survey-label" htmlFor="survey-age">{survey.ageLabel}</label>
              <select
                id="survey-age"
                className="v2-survey-input"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              >
                <option value="">{survey.agePlaceholder}</option>
                {survey.ageOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="v2-survey-field">
              <label className="v2-survey-label">{survey.genderLabel}</label>
              <div className="v2-survey-grid2">
                {survey.genderOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`v2-survey-tile${gender === opt ? ' v2-survey-tile--on' : ''}`}
                  >
                    <input
                      type="radio"
                      name="survey-gender"
                      value={opt}
                      checked={gender === opt}
                      onChange={() => setGender(opt)}
                      className="v2-survey-radio-input"
                    />
                    <span className="v2-survey-radio" aria-hidden="true" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="v2-survey-field">
              <label className="v2-survey-label" htmlFor="survey-source">{survey.sourceLabel}</label>
              <select
                id="survey-source"
                className="v2-survey-input"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                <option value="">{survey.sourcePlaceholder}</option>
                {survey.sourceOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {showSourceOther && (
                <input
                  type="text"
                  className="v2-survey-input v2-survey-input--inline"
                  placeholder={survey.sourceOtherPlaceholder}
                  value={sourceOther}
                  onChange={(e) => setSourceOther(e.target.value)}
                  maxLength={120}
                />
              )}
            </div>

            <div className="v2-survey-field">
              <label className="v2-survey-label">{survey.signupForLabel}</label>
              <div className="v2-survey-toggle" role="radiogroup">
                <button
                  type="button"
                  role="radio"
                  aria-checked={signupFor === 'self'}
                  className={`v2-survey-toggle-opt${signupFor === 'self' ? ' v2-survey-toggle-opt--on' : ''}`}
                  onClick={() => setSignupFor('self')}
                >
                  {survey.signupForSelf}
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={signupFor === 'family'}
                  className={`v2-survey-toggle-opt${signupFor === 'family' ? ' v2-survey-toggle-opt--on' : ''}`}
                  onClick={() => setSignupFor('family')}
                >
                  {survey.signupForFamily}
                </button>
              </div>
            </div>

            <div className={`v2-survey-field v2-survey-field--family${fam ? '' : ' v2-survey-field--off'}`}>
              <label className="v2-survey-label" htmlFor="survey-family-age">{survey.familyAgeLabel}</label>
              <select
                id="survey-family-age"
                className="v2-survey-input"
                value={familyAge}
                onChange={(e) => setFamilyAge(e.target.value)}
                disabled={!fam}
              >
                <option value="">{survey.familyAgePlaceholder}</option>
                {survey.ageOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Computer-type field — radio tile group (Mac / Windows /
                Other) using the same .v2-survey-tile pattern as gender,
                followed by an inline "Other" text input when the trailing
                option is picked, and a small notice clarifying that the
                first trial is MacBook-only. */}
            <div className="v2-survey-field">
              <label className="v2-survey-label">{survey.computerLabel}</label>
              <div className="v2-survey-grid2">
                {survey.computerOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`v2-survey-tile${computer === opt ? ' v2-survey-tile--on' : ''}`}
                  >
                    <input
                      type="radio"
                      name="survey-computer"
                      value={opt}
                      checked={computer === opt}
                      onChange={() => setComputer(opt)}
                      className="v2-survey-radio-input"
                    />
                    <span className="v2-survey-radio" aria-hidden="true" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              {(computer === 'Other' || computer === 'Loại khác') && (
                <input
                  type="text"
                  className="v2-survey-input v2-survey-input--inline"
                  placeholder={survey.computerOtherPlaceholder}
                  value={computerOther}
                  onChange={(e) => setComputerOther(e.target.value)}
                  maxLength={64}
                />
              )}
              <p className="v2-survey-notice">{survey.computerNotice}</p>
            </div>

            <div className="v2-survey-field">
              <label className="v2-survey-label" htmlFor="survey-needs">{survey.needsLabel}</label>
              <textarea
                id="survey-needs"
                className="v2-survey-input v2-survey-textarea"
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                placeholder={survey.needsPlaceholder}
                rows={3}
                maxLength={500}
              />
            </div>

            {state === 'error' && (
              <p className="v2-survey-error" role="alert">{survey.errorServer}</p>
            )}
            {state === 'mustComplete' && (
              <p className="v2-survey-error" role="alert">{survey.errorMustComplete}</p>
            )}

            {/* Skip button removed — survey is required. Submit is
                the only path that dismisses the modal. */}
            <div className="v2-survey-actions">
              <button type="submit" className="v2-survey-submit" disabled={submitting}>
                <span className="v2-survey-submit-body">{submitLabel}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}
