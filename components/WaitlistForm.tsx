'use client'

import { useState, FormEvent } from 'react'
import { useLocale } from '@/lib/LocaleProvider'

type FormState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

export default function WaitlistForm() {
  const { t } = useLocale()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [validationError, setValidationError] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setValidationError(false)

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isValidEmail) {
      setValidationError(true)
      return
    }

    setState('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setState('success')
      } else if (res.status === 409) {
        setState('duplicate')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'success' || state === 'duplicate') {
    const msg = state === 'success' ? t.form.success : t.form.errorDuplicate
    return (
      <div className="bg-mint-light border border-mint rounded-md px-4 py-3 text-sm text-mint-dark font-medium">
        {msg}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setValidationError(false) }}
          placeholder={t.form.placeholder}
          disabled={state === 'loading'}
          className={`flex-1 bg-card-bg border rounded-md px-4 py-3 text-sm text-text placeholder-muted-light outline-none
            focus:border-mint transition-colors
            ${validationError ? 'border-red-400' : 'border-border'}`}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="bg-mint hover:bg-mint-dark disabled:opacity-60 text-white font-bold text-sm px-5 py-3 rounded-md transition-colors whitespace-nowrap"
        >
          {state === 'loading' ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : t.form.submit}
        </button>
      </div>
      {validationError && (
        <p className="mt-1.5 text-xs text-red-500">{t.form.errorValidation}</p>
      )}
      {state === 'error' && (
        <p className="mt-1.5 text-xs text-red-500">{t.form.errorServer}</p>
      )}
    </form>
  )
}
