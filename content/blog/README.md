# Writing Codepet blog posts

Each article is a Markdown file in this folder. The blog is bilingual:
the same article has one file per language, sharing a **slug**.

```
content/blog/
  my-post.en.md      → https://code-pet.com/blog/my-post
  my-post.vi.md      → https://code-pet.com/vi/blog/my-post
```

The slug is the filename without the `.<locale>.md` suffix. Use lowercase
words separated by hyphens — it becomes the URL, so keep it descriptive
and stable (changing it breaks links and loses SEO history).

## Frontmatter

Every file starts with a YAML block:

```markdown
---
title: "Your headline — write it for humans and search"
description: "1–2 sentence summary. Shows in search results, social cards, and the post list. ~150 chars."
date: "2026-06-11"          # publish date, YYYY-MM-DD
updated: "2026-06-12"       # optional, last meaningful edit
category: "building-ai-products"   # one of the three below
author: "Nguyen"
authorTitle: "Founder, Codepet"     # optional
tags: ["ai", "product"]            # optional
cover: "/blog/my-post/cover.png"   # optional hero/social image (1200×630)
coverAlt: "Description of the cover"  # optional
draft: false                # true = visible in dev, hidden in prod + sitemap
featured: false             # true = pinned as the lead story on the index
---
```

### Categories (`category:`)

| slug                   | EN label              | Use for…                                            |
| ---------------------- | --------------------- | --------------------------------------------------- |
| `building-ai-products` | Building AI Products  | The journey of building an AI-powered product        |
| `user-insights`        | User Insights         | What we learn from real users                         |
| `second-brain`         | Second Brain          | Building with AI & developing a second, smart brain  |

## Body

Standard Markdown: `##`/`###` headings, **bold**, lists, `code`, fenced
code blocks, > blockquotes, tables, images, and links. Notes:

- `##` and `###` headings automatically get anchor links and, when a post
  has 3+ of them, a "On this page" table of contents.
- Use **relative links** for internal pages, e.g.
  `[Building AI Products](/blog/category/building-ai-products)` (EN) or the
  `/vi/...` equivalent in Vietnamese posts.
- Images: drop assets under `public/blog/<slug>/` and reference them as
  `/blog/<slug>/image.png`.
- Reading time is computed automatically from word count.

## SEO — handled for you

Per post you get: canonical URL, EN↔VI `hreflang` alternates (only for
locales the post actually exists in), Open Graph + Twitter cards, a
generated social image (`/blog/og`), `BlogPosting` + `BreadcrumbList`
JSON-LD, sitemap entries, and inclusion in the RSS feed
(`/blog/feed.xml`, `/vi/blog/feed.xml`).

You don't have to translate every post — a post with only an `.en.md`
file simply won't appear on the Vietnamese blog, and vice-versa.

## Preview locally

```bash
yarn dev      # drafts (draft: true) are visible in dev only
```

Visit `/blog` and `/vi/blog`.
