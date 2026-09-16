import type { Metadata } from 'next'
import en from '@/lib/i18n/en.json'
import DownloadPage from './DownloadPage'

/**
 * Metadata is exported from a SERVER component, which is why the page is split in two: the
 * body needs `useLocale` and therefore has to be a client component, and a client component
 * cannot export `metadata`.
 *
 * English only, deliberately. Locale here is resolved per request from a Vercel geo header
 * (see the root layout) while `metadata` is evaluated when the route is rendered — so a
 * localized title would be a coin flip rather than a translation. The visible copy still
 * switches language; this is the tab title and the link preview.
 */
export const metadata: Metadata = {
  title: en.download.metaTitle,
  description: en.download.metaDescription,
}

export default function Page() {
  return <DownloadPage />
}
