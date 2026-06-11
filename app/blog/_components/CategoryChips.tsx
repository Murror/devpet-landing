import Link from 'next/link'
import type { Locale } from '@/lib/site'
import { CATEGORIES } from '@/lib/blog/categories'
import { blogIndexPath, categoryPath } from '@/lib/blog/format'
import { blogStrings } from '@/lib/blog/ui-strings'

/**
 * Topic filter row. "All articles" returns to the index; each pillar
 * links to its `/blog/category/<slug>` page. `activeSlug` is set on a
 * category page to highlight the current filter (and 'all' on index).
 */
export default function CategoryChips({
  locale,
  activeSlug = 'all',
}: {
  locale: Locale
  activeSlug?: string
}) {
  const s = blogStrings(locale)
  return (
    <nav className="blog-chips" aria-label={s.browseTopics}>
      <Link
        href={blogIndexPath(locale)}
        className="blog-chip"
        data-active={activeSlug === 'all'}
      >
        {s.allTopics}
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={categoryPath(locale, c.slug)}
          className="blog-chip"
          data-active={activeSlug === c.slug}
        >
          <span className="blog-chip-dot" />
          {c.label[locale]}
        </Link>
      ))}
    </nav>
  )
}
