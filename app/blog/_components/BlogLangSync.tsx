'use client'

import { useEffect } from 'react'
import type { Locale } from '@/lib/site'

/**
 * The root layout renders `<html lang>` from the visitor's IP country,
 * which is the right default for the landing page but wrong for a
 * locale-fixed blog route. This tiny client component corrects the
 * document language to match the route the reader is actually on
 * (`/blog` → en, `/vi/blog` → vi) so screen readers and crawlers see
 * the correct language.
 */
export default function BlogLangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
