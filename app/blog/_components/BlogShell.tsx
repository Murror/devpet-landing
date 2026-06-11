import type { ReactNode } from 'react'
import type { Locale } from '@/lib/site'
import BlogBar from './BlogBar'
import BlogFooter from './BlogFooter'
import BlogLangSync from './BlogLangSync'

/**
 * Page chrome shared by every blog route: the light `.blog-root`
 * ground (which overrides the app's dark landing background), the
 * sticky top bar, footer, and the route-locale `<html lang>` fix.
 */
export default function BlogShell({
  locale,
  altHref,
  children,
}: {
  locale: Locale
  altHref?: string
  children: ReactNode
}) {
  return (
    <div className="blog-root">
      <BlogLangSync locale={locale} />
      <BlogBar locale={locale} altHref={altHref} />
      {children}
      <BlogFooter locale={locale} />
    </div>
  )
}
