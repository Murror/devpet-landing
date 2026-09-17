import type { Locale } from '@/lib/site'
import { localePrefix } from '@/lib/site'

/** Root-relative path to the blog index for a locale. */
export function blogIndexPath(locale: Locale): string {
  return `${localePrefix(locale)}/blog`
}

/** Root-relative path to a single article. */
export function postPath(locale: Locale, slug: string): string {
  return `${localePrefix(locale)}/blog/${slug}`
}

/** Root-relative path to a category filter page. */
export function categoryPath(locale: Locale, categorySlug: string): string {
  return `${localePrefix(locale)}/blog/category/${categorySlug}`
}

const DATE_LOCALE: Record<Locale, string> = {
  en: 'en-US',
  vi: 'vi-VN',
}

/** Human date, e.g. "June 11, 2026" / "11 tháng 6, 2026". */
export function formatDate(iso: string, locale: Locale): string {
  // Parse as UTC noon to dodge timezone date-shift on `YYYY-MM-DD`.
  const d = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

const READING_LABEL: Record<Locale, (m: number) => string> = {
  en: (m) => `${m} min read`,
  vi: (m) => `${m} phút đọc`,
}

export function formatReadingTime(minutes: number, locale: Locale): string {
  return READING_LABEL[locale](minutes)
}
