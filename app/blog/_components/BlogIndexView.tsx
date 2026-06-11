import type { Locale } from '@/lib/site'
import type { PostMeta } from '@/lib/blog/posts'
import { blogStrings } from '@/lib/blog/ui-strings'
import CategoryChips from './CategoryChips'
import PostCard from './PostCard'

/**
 * The listing surface, reused by the blog home and by each category
 * page. On the home (`lead` = true) the newest/featured post renders
 * as a wide lead card; the remainder fall into the responsive grid.
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
  const useLead = lead && posts.length > 2
  const leadPost = useLead ? posts[0] : null
  const rest = useLead ? posts.slice(1) : posts

  return (
    <main>
      <section className="blog-hero">
        <div className="blog-container">
          <h1>{title}</h1>
          <p>{tagline}</p>
          <CategoryChips locale={locale} activeSlug={activeSlug} />
        </div>
      </section>

      <div className="blog-container">
        {posts.length === 0 ? (
          <p className="blog-empty">{s.empty}</p>
        ) : (
          <>
            <p className="blog-section-label">
              {activeSlug === 'all' ? s.latest : s.allTopics}
            </p>
            <div className="blog-grid">
              {leadPost && (
                <PostCard
                  key={leadPost.slug}
                  post={leadPost}
                  locale={locale}
                  featured
                />
              )}
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
