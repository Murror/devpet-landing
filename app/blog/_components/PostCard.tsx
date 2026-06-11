import Link from 'next/link'
import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { postPath, formatDate, formatReadingTime } from '@/lib/blog/format'
import { getCategory } from '@/lib/blog/categories'

const ACCENT_CLASS: Record<string, string> = {
  primary: 'blog-accent-primary',
  info: 'blog-accent-info',
  premium: 'blog-accent-premium',
}

export default function PostCard({
  post,
  locale,
  featured = false,
}: {
  post: PostMeta
  locale: Locale
  featured?: boolean
}) {
  const category = getCategory(post.category)
  const accentClass = category ? ACCENT_CLASS[category.accent] : ''

  return (
    <Link
      href={postPath(locale, post.slug)}
      className={`blog-card${featured ? ' blog-card--featured' : ''}`}
    >
      {post.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="blog-card-cover"
          src={post.cover}
          alt={post.coverAlt || ''}
          loading="lazy"
        />
      ) : (
        <div className="blog-card-cover blog-card-cover--placeholder">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/v2/logo/codepet-c.png" alt="" width={56} height={70} />
        </div>
      )}
      <div className="blog-card-body">
        {category && (
          <span className={`blog-card-cat ${accentClass}`}>
            {category.label[locale]}
          </span>
        )}
        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{post.description}</p>
        <div className="blog-card-meta">
          {formatDate(post.date, locale)} ·{' '}
          {formatReadingTime(post.readingMinutes, locale)}
        </div>
      </div>
    </Link>
  )
}
