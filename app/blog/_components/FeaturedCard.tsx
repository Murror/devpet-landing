import Link from 'next/link'
import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { postPath, formatDate, formatReadingTime } from '@/lib/blog/format'
import { getCategory } from '@/lib/blog/categories'
import { blogStrings } from '@/lib/blog/ui-strings'
import Reveal from '../../v3/components/Reveal'
import CoverArt from './CoverArt'

/**
 * Featured lead story — a large cinematic card: the cover fills the
 * frame under a dark scrim (washed with the category hue), and the
 * editorial text is anchored low, matching the landing's sliding
 * "universe" panels. Hover lifts the card, glows its border in the
 * category colour, and slowly zooms the cover.
 */
export default function FeaturedCard({
  post,
  locale,
}: {
  post: PostMeta
  locale: Locale
}) {
  const s = blogStrings(locale)
  const category = getCategory(post.category)

  return (
    <Reveal>
      <Link
        href={postPath(locale, post.slug)}
        className="bx-featured"
        data-category={post.category}
      >
        <div className="bx-featured-media">
          {post.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover} alt={post.coverAlt || ''} />
          ) : (
            <CoverArt slug={post.slug} category={post.category} />
          )}
        </div>
        <div className="bx-featured-scrim" aria-hidden="true" />
        <div className="bx-featured-body">
          <div className="bx-featured-top">
            {category && (
              <span className="bx-eyebrow" data-category={post.category}>
                {category.label[locale]}
              </span>
            )}
            <span className="bx-featured-tag">{s.featured}</span>
          </div>
          <div className="bx-featured-foot">
            <h2 className="bx-featured-title">{post.title}</h2>
            <p className="bx-featured-excerpt">{post.description}</p>
            <div className="bx-meta">
              <span>{formatDate(post.date, locale)}</span>
              <span className="bx-dot" />
              <span>{formatReadingTime(post.readingMinutes, locale)}</span>
              <span className="bx-featured-read">{s.readMore}</span>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}
