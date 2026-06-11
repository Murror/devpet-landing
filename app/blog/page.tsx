import type { Metadata } from 'next'
import { renderBlogIndex } from '@/app/blog/_components/pages'
import { buildIndexMetadata } from '@/lib/blog/seo'

export const metadata: Metadata = buildIndexMetadata('en')

export default function BlogIndexPage() {
  return renderBlogIndex('en')
}
