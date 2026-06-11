import type { Metadata } from 'next'
import { renderArticlePage } from '@/app/blog/_components/pages'
import { getAllPublishedRefs, getPostMeta } from '@/lib/blog/posts'
import { buildArticleMetadata } from '@/lib/blog/seo'

export function generateStaticParams() {
  return getAllPublishedRefs('en')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostMeta(slug, 'en')
  return post ? buildArticleMetadata(post) : {}
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return renderArticlePage('en', slug)
}
