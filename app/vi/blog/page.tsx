import type { Metadata } from 'next'
import { renderBlogIndex } from '@/app/blog/_components/pages'
import { buildIndexMetadata } from '@/lib/blog/seo'

export const metadata: Metadata = buildIndexMetadata('vi')

export default function ViBlogIndexPage() {
  return renderBlogIndex('vi')
}
