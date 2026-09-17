import type { Metadata } from 'next'
import type { Locale } from '@/lib/site'
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  LOCALES,
  absoluteUrl,
} from '@/lib/site'
import type { Post, PostMeta } from './posts'
import { getCategory, type Category } from './categories'
import { blogIndexPath, postPath, categoryPath } from './format'
import { blogStrings } from './ui-strings'

// Open Graph locale codes Facebook/LinkedIn expect.
const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  vi: 'vi_VN',
}

/** Branded OG image URL generated on the fly by /blog/og. */
function ogImageUrl(opts: {
  title: string
  category?: string
  locale: Locale
}): string {
  const params = new URLSearchParams({
    title: opts.title,
    lang: opts.locale,
  })
  if (opts.category) params.set('category', opts.category)
  return `${SITE_URL}/blog/og?${params.toString()}`
}

/**
 * hreflang alternates. `paths` maps each available locale to its
 * root-relative URL for this piece of content. `x-default` points at
 * the English variant (our default market language).
 */
function languageAlternates(
  paths: Partial<Record<Locale, string>>
): Record<string, string> {
  const langs: Record<string, string> = {}
  for (const loc of LOCALES) {
    if (paths[loc]) langs[loc] = absoluteUrl(paths[loc]!)
  }
  if (paths.en) langs['x-default'] = absoluteUrl(paths.en)
  return langs
}

/** Metadata for the blog index (and shared shape for category pages). */
export function buildIndexMetadata(
  locale: Locale,
  overrides?: { title?: string; description?: string; path?: string }
): Metadata {
  const s = blogStrings(locale)
  const title = overrides?.title ?? s.metaIndexTitle
  const description = overrides?.description ?? s.metaIndexDescription
  const path = overrides?.path ?? blogIndexPath(locale)
  const canonical = absoluteUrl(path)

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates({
        en: path.replace(/^\/vi/, ''),
        vi: path.startsWith('/vi') ? path : `/vi${path}`,
      }),
      types: {
        'application/rss+xml': absoluteUrl(`${blogIndexPath(locale)}/feed.xml`),
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      url: canonical,
      title,
      description,
      images: [{ url: ogImageUrl({ title: s.indexTitle, locale }) }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl({ title: s.indexTitle, locale })],
    },
  }
}

export function buildCategoryMetadata(
  locale: Locale,
  category: Category
): Metadata {
  const label = category.label[locale]
  const title = `${label} — ${SITE_NAME} Blog`
  return buildIndexMetadata(locale, {
    title,
    description: category.description[locale],
    path: categoryPath(locale, category.slug),
  })
}

/** Per-article metadata: canonical, hreflang, article OG, Twitter. */
export function buildArticleMetadata(post: PostMeta): Metadata {
  const { locale, slug } = post
  const canonical = absoluteUrl(postPath(locale, slug))
  const category = getCategory(post.category)

  // Only emit hreflang for locales this article actually exists in.
  const altPaths: Partial<Record<Locale, string>> = {}
  for (const loc of post.availableLocales) {
    altPaths[loc] = postPath(loc, slug)
  }

  const ogImage = post.cover
    ? absoluteUrl(post.cover)
    : ogImageUrl({
        title: post.title,
        category: category?.label[locale],
        locale,
      })

  return {
    title: `${post.title} — ${SITE_NAME}`,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: {
      canonical,
      languages: languageAlternates(altPaths),
    },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      url: canonical,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [post.author],
      section: category?.label[locale],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  }
}

/* ───────────────────────── JSON-LD ───────────────────────── */

function publisher() {
  return {
    '@type': 'Organization',
    name: 'MURROR',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icons/codepet-icon-512.png'),
    },
  }
}

/** BlogPosting + BreadcrumbList for an article page. */
export function articleJsonLd(post: Post): object[] {
  const { locale } = post
  const url = absoluteUrl(postPath(locale, post.slug))
  const category = getCategory(post.category)
  const s = blogStrings(locale)

  const image = post.cover
    ? absoluteUrl(post.cover)
    : ogImageUrl({
        title: post.title,
        category: category?.label[locale],
        locale,
      })

  const blogPosting = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.description,
    image: [image],
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: locale,
    author: { '@type': 'Person', name: post.author },
    publisher: publisher(),
    articleSection: category?.label[locale],
    keywords: (post.tags ?? []).join(', '),
    wordCount: post.readingMinutes * 200,
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: s.brandHome,
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: absoluteUrl(blogIndexPath(locale)),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  }

  return [blogPosting, breadcrumb]
}

/** Blog (collection) schema for the index, listing recent posts. */
export function blogJsonLd(locale: Locale, posts: PostMeta[]): object {
  const s = blogStrings(locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': absoluteUrl(blogIndexPath(locale)),
    name: s.metaIndexTitle,
    description: SITE_TAGLINE,
    url: absoluteUrl(blogIndexPath(locale)),
    inLanguage: locale,
    publisher: publisher(),
    blogPost: posts.slice(0, 20).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      url: absoluteUrl(postPath(locale, p.slug)),
      author: { '@type': 'Person', name: p.author },
    })),
  }
}
