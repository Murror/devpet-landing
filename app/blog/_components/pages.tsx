import { notFound } from 'next/navigation'
import type { Locale } from '@/lib/site'
import {
  getAllPosts,
  getPost,
  getPostsByCategory,
  getRelatedPosts,
} from '@/lib/blog/posts'
import { getCategory } from '@/lib/blog/categories'
import { blogIndexPath, postPath, categoryPath } from '@/lib/blog/format'
import { blogStrings } from '@/lib/blog/ui-strings'
import { articleJsonLd, blogJsonLd } from '@/lib/blog/seo'
import BlogShell from './BlogShell'
import BlogIndexView from './BlogIndexView'
import ArticleView from './ArticleView'
import JsonLd from './JsonLd'

const other = (locale: Locale): Locale => (locale === 'en' ? 'vi' : 'en')

/** Blog home for a locale. */
export function renderBlogIndex(locale: Locale) {
  const posts = getAllPosts(locale)
  const s = blogStrings(locale)
  return (
    <BlogShell locale={locale} altHref={blogIndexPath(other(locale))}>
      <JsonLd data={blogJsonLd(locale, posts)} />
      <BlogIndexView
        locale={locale}
        posts={posts}
        title={s.indexTitle}
        tagline={s.indexTagline}
      />
    </BlogShell>
  )
}

/** Single article for a locale; 404s when the translation is absent. */
export function renderArticlePage(locale: Locale, slug: string) {
  const post = getPost(slug, locale)
  if (!post) notFound()

  const related = getRelatedPosts(slug, locale, post.category)
  // Offer the language toggle target only when a translation exists,
  // otherwise fall back to the other locale's blog index.
  const altHref = post.availableLocales.includes(other(locale))
    ? postPath(other(locale), slug)
    : blogIndexPath(other(locale))

  return (
    <BlogShell locale={locale} altHref={altHref}>
      <JsonLd data={articleJsonLd(post)} />
      <ArticleView post={post} locale={locale} related={related} />
    </BlogShell>
  )
}

/** Category-filtered listing; 404s on an unknown category slug. */
export function renderCategoryPage(locale: Locale, categorySlug: string) {
  const category = getCategory(categorySlug)
  if (!category) notFound()

  const posts = getPostsByCategory(locale, category.slug)
  return (
    <BlogShell
      locale={locale}
      altHref={categoryPath(other(locale), category.slug)}
    >
      <BlogIndexView
        locale={locale}
        posts={posts}
        title={category.label[locale]}
        tagline={category.description[locale]}
        activeSlug={category.slug}
        lead={false}
      />
    </BlogShell>
  )
}
