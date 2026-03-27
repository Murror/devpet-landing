'use client'

import { useState, FormEvent } from 'react'
import { useLocale } from '@/lib/LocaleProvider'
import { motion, AnimatePresence } from 'framer-motion'

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

    // TODO: Connect to a backend API (e.g. Cloudflare Worker, Vercel serverless)
    // For now, show success on static hosting
    setState('success')
  }

  if (state === 'success' || state === 'duplicate') {
    const msg = state === 'success' ? t.form.success : t.form.errorDuplicate
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="bg-mint-light border border-mint rounded-md px-4 py-3 text-sm text-mint-dark font-medium"
      >
        {msg}
      </motion.div>
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
            focus:border-mint focus:shadow-[0_0_0_3px_rgba(52,211,153,0.12)] transition-[border-color,box-shadow] duration-150
            ${validationError ? 'border-red-400' : 'border-border'}`}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          className="bg-mint hover:bg-mint-dark disabled:opacity-60 text-white font-bold text-sm px-5 py-3 rounded-md transition-[background-color,transform] duration-150 ease-out whitespace-nowrap active:scale-[0.97]"
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
            className="mt-1.5 text-xs text-red-500"
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
            className="mt-1.5 text-xs text-red-500"
          >
            {t.form.errorServer}
          </motion.p>
        )}
      </AnimatePresence>
      {t.form.spotsLeft && (
        <p className="mt-2 text-[11px] text-mint-dark font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-mint rounded-full animate-pulse" />
          {t.form.spotsLeft}
        </p>
      )}
    </form>
  )
}
