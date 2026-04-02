'use client'

import { useState, FormEvent } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { motion, AnimatePresence } from 'framer-motion'

type FormState = 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

export default function WaitlistForm() {
  const { t, locale } = useLocale()
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
        body: JSON.stringify({ email, locale }),
      })
      const data = await res.json()
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

  if (state === 'success' || state === 'duplicate') {
    const msg = state === 'success' ? t.form.success : t.form.errorDuplicate
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="bg-primary-tint border border-primary/30 rounded-lg px-4 py-3 text-sm text-primary-dark"
      >
        {msg}
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setValidationError(false) }}
          placeholder={t.form.placeholder}
          disabled={state === 'loading'}
          className={`flex-1 bg-bg pixel-input px-4 py-3 text-sm text-text placeholder-muted-light
            ${validationError ? '!border-danger' : ''}`}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="pixel-btn text-white text-[15px] uppercase tracking-[1px] px-6 py-3 whitespace-nowrap"
        >
          {state === 'loading' ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : t.form.submit}
        </button>
      </div>
      <AnimatePresence>
        {validationError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 text-xs text-danger"
          >
            {t.form.errorValidation}
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {state === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 text-xs text-danger"
          >
            {t.form.errorServer}
          </motion.p>
        )}
      </AnimatePresence>
      {t.form.spotsLeft && (
        <p className="mt-2 text-[11px] text-current opacity-70 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse opacity-60" />
          {t.form.spotsLeft}
        </p>
      )}
    </form>
  )
}
