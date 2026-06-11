import Link from 'next/link'
import type { Locale } from '@/lib/site'
import { localePrefix } from '@/lib/site'
import { blogIndexPath } from '@/lib/blog/format'
import { blogStrings } from '@/lib/blog/ui-strings'

/**
 * Sticky top bar for the blog. Left: pixel "C" + Codepet/Blog
 * wordmark linking to the blog index. Right: link back to the main
 * site and a language switch to the mirror URL in the other locale.
 *
 * `altHref` is the equivalent page in the other language (e.g. the
 * same article's translation, or the other index) so the toggle keeps
 * the reader in context instead of dumping them on the blog home.
 */
export default function BlogBar({
  locale,
  altHref,
}: {
  locale: Locale
  altHref?: string
}) {
  const s = blogStrings(locale)
  const home = localePrefix(locale) || '/'
  const fallbackAlt = blogStrings(locale === 'en' ? 'vi' : 'en')
  const switchHref = altHref ?? fallbackAlt.langSwitchHref

  return (
    <header className="blog-bar">
      <div className="blog-bar-inner">
        <Link href={blogIndexPath(locale)} className="blog-bar-brand">
          {/* Plain img + image-rendering:pixelated keeps the 8-bit logo
              crisp; project ships images.unoptimized so there's no
              optimizer to route around. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/v2/logo/codepet-c.png" alt="" width={28} height={35} />
          <span>
            {s.brandHome} <span className="blog-bar-blogtag">/ Blog</span>
          </span>
        </Link>

        <nav className="blog-bar-actions" aria-label={s.brandHome}>
          <Link href={home} className="blog-bar-link">
            {s.backToSite}
          </Link>
          <Link href={switchHref} className="blog-bar-lang" hrefLang={locale === 'en' ? 'vi' : 'en'}>
            {s.langSwitch}
          </Link>
        </nav>
      </div>
    </header>
  )
}
