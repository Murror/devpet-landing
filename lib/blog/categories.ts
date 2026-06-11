import type { Locale } from '@/lib/site'

/**
 * The blog's three editorial pillars. These map directly to the content
 * strategy: (1) the journey of building an AI-powered product, (2) what
 * we learn from users, and (3) the harder problems Codepet is moving
 * toward — building AI products and growing a "second brain".
 *
 * `slug` is the stable key used in post frontmatter (`category:`) and in
 * the `/blog/category/<slug>` filter URLs, so it must never change once
 * articles reference it. Labels/descriptions are localized for the
 * EN and VI surfaces.
 */
export type CategorySlug =
  | 'building-ai-products'
  | 'user-insights'
  | 'second-brain'

export interface Category {
  slug: CategorySlug
  /** Accent color (Tailwind token from the brand palette) for chips. */
  accent: 'primary' | 'info' | 'premium'
  label: Record<Locale, string>
  description: Record<Locale, string>
}

export const CATEGORIES: Category[] = [
  {
    slug: 'building-ai-products',
    accent: 'primary',
    label: {
      en: 'Building AI Products',
      vi: 'Xây dựng sản phẩm AI',
    },
    description: {
      en: 'The unfiltered journey of building an AI-powered product — the bets, the rewrites, and what actually shipped.',
      vi: 'Hành trình thật khi xây dựng một sản phẩm AI — những đánh cược, những lần viết lại, và thứ thực sự ra mắt.',
    },
  },
  {
    slug: 'user-insights',
    accent: 'info',
    label: {
      en: 'User Insights',
      vi: 'Thấu hiểu người dùng',
    },
    description: {
      en: 'What real builders taught us — patterns, surprises, and the gaps we found watching people learn to ship.',
      vi: 'Những gì người dùng thật dạy chúng tôi — các mẫu hành vi, bất ngờ, và khoảng trống khi mọi người học cách ra sản phẩm.',
    },
  },
  {
    slug: 'second-brain',
    accent: 'premium',
    label: {
      en: 'Second Brain',
      vi: 'Bộ não thứ hai',
    },
    description: {
      en: 'The harder problems ahead: building with AI and growing a second, intelligent brain that thinks alongside you.',
      vi: 'Những bài toán khó phía trước: xây dựng cùng AI và nuôi dưỡng một bộ não thứ hai biết suy nghĩ cùng bạn.',
    },
  },
]

const BY_SLUG = new Map(CATEGORIES.map((c) => [c.slug, c]))

export function getCategory(slug: string): Category | undefined {
  return BY_SLUG.get(slug as CategorySlug)
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return BY_SLUG.has(slug as CategorySlug)
}
