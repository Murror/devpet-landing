import type { Metadata } from 'next'
import { renderCategoryPage } from '@/app/blog/_components/pages'
import { CATEGORIES, getCategory } from '@/lib/blog/categories'
import { buildCategoryMetadata } from '@/lib/blog/seo'

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const cat = getCategory(category)
  return cat ? buildCategoryMetadata('en', cat) : {}
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  return renderCategoryPage('en', category)
}
