import Link from 'next/link'
import type { Locale } from '@/lib/site'
import { localePrefix } from '@/lib/site'
import type { Post, PostMeta } from '@/lib/blog/posts'
import {
  blogIndexPath,
  categoryPath,
  formatDate,
  formatReadingTime,
} from '@/lib/blog/format'
import { getCategory } from '@/lib/blog/categories'
import { blogStrings } from '@/lib/blog/ui-strings'
import PostCard from './PostCard'
import CoverArt from './CoverArt'

const ACCENT_CLASS: Record<string, string> = {
  primary: 'blog-accent-primary',
  info: 'blog-accent-info',
  premium: 'blog-accent-premium',
}

export default function ArticleView({
  post,
  locale,
  related,
}: {
  post: Post
  locale: Locale
  related: PostMeta[]
}) {
  const s = blogStrings(locale)
  const category = getCategory(post.category)
  const accentClass = category ? ACCENT_CLASS[category.accent] : ''
  const home = localePrefix(locale) || '/'

  return (
    <main>
      <article className="blog-article">
        <Link href={blogIndexPath(locale)} className="blog-article-back">
          {s.backToBlog}
        </Link>

        {category && (
          <Link
            href={categoryPath(locale, category.slug)}
            className={`blog-article-cat ${accentClass}`}
          >
            {category.label[locale]}
          </Link>
        )}

        <h1 className="blog-article-title">{post.title}</h1>
        <p className="blog-article-dek">{post.description}</p>

        <div className="blog-article-byline">
          <span>{formatDate(post.date, locale)}</span>
          <span className="dot">
            {formatReadingTime(post.readingMinutes, locale)}
          </span>
          {post.updated && post.updated !== post.date && (
            <span className="dot">
              {s.updatedOn} {formatDate(post.updated, locale)}
            </span>
          )}
        </div>

        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="blog-article-cover"
            src={post.cover}
            alt={post.coverAlt || ''}
          />
        ) : (
          <div className="blog-article-cover">
            <CoverArt slug={post.slug} category={post.category} />
          </div>
        )}

        {post.toc.length >= 3 && (
          <nav className="blog-toc" aria-label={s.tableOfContents}>
            <p className="blog-toc-label">{s.tableOfContents}</p>
            <ul>
              {post.toc.map((item) => (
                <li key={item.id} className={`depth-${item.depth}`}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div
          className="blog-prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="blog-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      <section className="blog-cta" aria-label={s.ctaTitle}>
        <h2>{s.ctaTitle}</h2>
        <p>{s.ctaBody}</p>
        <Link href={home}>{s.ctaButton}</Link>
      </section>

      {related.length > 0 && (
        <section className="blog-related">
          <p className="blog-section-label">{s.relatedReading}</p>
          <div className="blog-grid">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
