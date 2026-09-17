import Link from 'next/link'
import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { postPath, formatDate, formatReadingTime } from '@/lib/blog/format'
import { getCategory } from '@/lib/blog/categories'
import { blogStrings } from '@/lib/blog/ui-strings'
import Reveal from '../../v3/components/Reveal'
import CoverArt from './CoverArt'

/**
 * Article row — the alternating "zigzag" listing kept from the old blog,
 * re-themed dark: a wide glass card (cover + centered text) beside a small
 * side-note column (date · reading time + a "Read" pill). Odd/even rows
 * (via `index`) flip the image side and the aside side. Category hue drives
 * the eyebrow + hover glow; the row fades/rises in on scroll via Reveal.
 */
export default function PostCard({
  post,
  locale,
  index = 0,
}: {
  post: PostMeta
  locale: Locale
  index?: number
}) {
  const s = blogStrings(locale)
  const category = getCategory(post.category)
  const href = postPath(locale, post.slug)
  const flip = index % 2 === 1

  return (
    <Reveal className="bx-zz-row">
      <article
        className={`bx-zz${flip ? ' bx-zz--flip' : ''}`}
        data-category={post.category}
      >
        <Link href={href} className="bx-zz-card">
          <div className="bx-zz-cover">
            {post.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.cover} alt={post.coverAlt || ''} loading="lazy" />
            ) : (
              <CoverArt slug={post.slug} category={post.category} />
            )}
            <div className="bx-zz-scrim" aria-hidden="true" />
          </div>
          <div className="bx-zz-body">
            {category && (
              <span className="bx-eyebrow" data-category={post.category}>
                {category.label[locale]}
              </span>
            )}
            <h3 className="bx-zz-title">{post.title}</h3>
            <p className="bx-zz-excerpt">{post.description}</p>
          </div>
        </Link>

        <div className="bx-zz-aside">
          <div className="bx-meta bx-zz-note">
            <span>{formatDate(post.date, locale)}</span>
            <span className="bx-dot" />
            <span>{formatReadingTime(post.readingMinutes, locale)}</span>
          </div>
          <span className="bx-zz-rule" />
          <Link href={href} className="bx-zz-pill">
            {s.readMore}
          </Link>
        </div>
      </article>
    </Reveal>
  )
}
