import type { Locale } from '@/lib/site'

/**
 * UI chrome strings for the blog surface.
 *
 * The blog renders server-side with the locale fixed by the route
 * (`/blog` = en, `/vi/blog` = vi), so it reads from this static
 * dictionary rather than the client-side `LocaleProvider`. Keeping the
 * blog's labels here also keeps the (client) landing-page i18n bundle
 * from growing for strings only the blog uses.
 */
export interface BlogStrings {
  brandHome: string
  backToSite: string
  indexTitle: string
  indexTagline: string
  metaIndexTitle: string
  metaIndexDescription: string
  featured: string
  latest: string
  browseTopics: string
  allTopics: string
  by: string
  updatedOn: string
  tableOfContents: string
  backToBlog: string
  relatedReading: string
  moreInCategory: string
  readArticle: string
  empty: string
  langSwitch: string
  langSwitchHref: string
  ctaTitle: string
  ctaBody: string
  ctaButton: string
  newsletterTitle: string
  newsletterBody: string
  newsletterPlaceholder: string
  newsletterButton: string
  newsletterSuccess: string
  newsletterDuplicate: string
  newsletterError: string
  newsletterInvalid: string
}

const STRINGS: Record<Locale, BlogStrings> = {
  en: {
    brandHome: 'Codepet',
    backToSite: '← Back to Codepet',
    indexTitle: 'The Codepet Blog',
    indexTagline:
      'Field notes on building AI-powered products, what we learn from real builders, and growing a second, intelligent brain.',
    metaIndexTitle: 'Blog — Codepet',
    metaIndexDescription:
      'Insights on building AI-powered products, user research, and developing a second brain — from the team building Codepet.',
    featured: 'Featured',
    latest: 'Latest articles',
    browseTopics: 'Browse by topic',
    allTopics: 'All articles',
    by: 'By',
    updatedOn: 'Updated',
    tableOfContents: 'On this page',
    backToBlog: '← All articles',
    relatedReading: 'Keep reading',
    moreInCategory: 'More in',
    readArticle: 'Read article',
    empty: 'No articles yet — the first stories are on their way.',
    langSwitch: 'Tiếng Việt',
    langSwitchHref: '/vi/blog',
    ctaTitle: 'Build your own product with Codepet',
    ctaBody:
      'Codepet is a macOS app that coaches you from your first line of code to a shipped product — with an AI crew that grows as you do.',
    ctaButton: 'Get Codepet',
    newsletterTitle: 'Insights in your inbox',
    newsletterBody:
      'New essays on building AI products, user research, and the second brain — straight to your inbox. No spam.',
    newsletterPlaceholder: 'Enter your email',
    newsletterButton: 'Subscribe',
    newsletterSuccess: "You're in — watch your inbox.",
    newsletterDuplicate: "You're already subscribed.",
    newsletterError: 'Something went wrong. Try again.',
    newsletterInvalid: 'Please enter a valid email.',
  },
  vi: {
    brandHome: 'Codepet',
    backToSite: '← Về trang Codepet',
    indexTitle: 'Blog Codepet',
    indexTagline:
      'Ghi chép thực chiến về xây dựng sản phẩm AI, những điều học được từ người dùng thật, và cách nuôi dưỡng một bộ não thứ hai biết suy nghĩ.',
    metaIndexTitle: 'Blog — Codepet',
    metaIndexDescription:
      'Góc nhìn về xây dựng sản phẩm AI, nghiên cứu người dùng và phát triển bộ não thứ hai — từ đội ngũ đang xây dựng Codepet.',
    featured: 'Nổi bật',
    latest: 'Bài viết mới nhất',
    browseTopics: 'Chủ đề',
    allTopics: 'Tất cả bài viết',
    by: 'Bởi',
    updatedOn: 'Cập nhật',
    tableOfContents: 'Trong bài này',
    backToBlog: '← Tất cả bài viết',
    relatedReading: 'Đọc tiếp',
    moreInCategory: 'Thêm về',
    readArticle: 'Đọc bài',
    empty: 'Chưa có bài viết — những câu chuyện đầu tiên đang trên đường tới.',
    langSwitch: 'English',
    langSwitchHref: '/blog',
    ctaTitle: 'Xây sản phẩm của riêng bạn với Codepet',
    ctaBody:
      'Codepet là ứng dụng macOS đồng hành cùng bạn từ dòng code đầu tiên đến sản phẩm hoàn chỉnh — với một đội AI lớn lên cùng bạn.',
    ctaButton: 'Tải Codepet',
    newsletterTitle: 'Nhận bài viết qua email',
    newsletterBody:
      'Những bài viết mới về xây dựng sản phẩm AI, nghiên cứu người dùng và bộ não thứ hai — gửi thẳng vào hộp thư của bạn. Không spam.',
    newsletterPlaceholder: 'Nhập email của bạn',
    newsletterButton: 'Đăng ký',
    newsletterSuccess: 'Đã đăng ký — hãy để ý hộp thư nhé.',
    newsletterDuplicate: 'Bạn đã đăng ký rồi.',
    newsletterError: 'Có lỗi xảy ra. Vui lòng thử lại.',
    newsletterInvalid: 'Vui lòng nhập email hợp lệ.',
  },
}

export function blogStrings(locale: Locale): BlogStrings {
  return STRINGS[locale]
}
