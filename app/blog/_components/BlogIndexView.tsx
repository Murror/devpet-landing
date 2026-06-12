import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { blogStrings } from '@/lib/blog/ui-strings'
import CategoryChips from './CategoryChips'
import PostCard from './PostCard'
import FeaturedCard from './FeaturedCard'
import NewsletterBand from './NewsletterBand'

/**
 * "Newsroom" listing surface (dark, black+-inspired): centered hero,
 * category filter row, a large featured lead story, a newsletter band,
 * then a grid of rich cover-art cards. Reused by the blog home and by
 * each category page (category pages drop the lead + newsletter).
 */
export default function BlogIndexView({
  locale,
  posts,
  title,
  tagline,
  activeSlug = 'all',
  lead = true,
}: {
  locale: Locale
  posts: PostMeta[]
  title: string
  tagline: string
  activeSlug?: string
  lead?: boolean
}) {
  const s = blogStrings(locale)
  const useLead = lead && posts.length > 0
  const leadPost = useLead ? posts[0] : null
  const rest = useLead ? posts.slice(1) : posts

  return (
    <main>
      <section className="blog-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="blog-hero-bg" src="/blog/hero.png" alt="" aria-hidden="true" />
        <div className="blog-hero-shade" aria-hidden="true" />
        <div className="blog-hero-wrap">
          <div className="blog-hero-glass">
            <div className="blog-hero-main">
              <h1>{title}</h1>
              <p>{tagline}</p>
              <a className="blog-hero-cta" href="#latest">
                {s.latest}
              </a>
            </div>
            <div className="blog-hero-strip">
              <CategoryChips locale={locale} activeSlug={activeSlug} />
            </div>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="blog-container">
          <p className="blog-empty">{s.empty}</p>
        </div>
      ) : (
        <>
          {leadPost && (
            <div className="blog-container">
              <FeaturedCard post={leadPost} locale={locale} />
            </div>
          )}

          {lead && <NewsletterBand locale={locale} />}

          {rest.length > 0 && (
            <div className="blog-container" id="latest">
              <p className="blog-section-label">
                {activeSlug === 'all' ? s.latest : s.allTopics}
              </p>
              <div className="blog-grid">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  )
}
