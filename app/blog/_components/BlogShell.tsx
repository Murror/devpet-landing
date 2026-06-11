import type { ReactNode } from 'react'
import type { Locale } from '@/lib/site'
import BlogV2Nav from './BlogV2Nav'
import BlogV2Footer from './BlogV2Footer'
import BlogLangSync from './BlogLangSync'

/**
 * Page chrome shared by every blog route. Wraps content in the site's
 * `.v2-root` dark theme (and `.v2-root--vi` for Vietnamese, which swaps
 * the pixel font stack to DearPix) so the blog matches the main page,
 * then renders the reused v2 nav + footer around a `.blog-root` reading
 * surface. `altHref` is the equivalent page in the other locale, used by
 * the nav's language switch.
 */
export default function BlogShell({
  locale,
  altHref,
  children,
}: {
  locale: Locale
  altHref: string
  children: ReactNode
}) {
  const rootClass = `v2-root blog-v2${locale === 'vi' ? ' v2-root--vi' : ''}`
  return (
    <div className={rootClass}>
      <BlogLangSync locale={locale} />
      <BlogV2Nav locale={locale} altHref={altHref} />
      <div className="blog-root">{children}</div>
      <BlogV2Footer locale={locale} />
    </div>
  )
}
