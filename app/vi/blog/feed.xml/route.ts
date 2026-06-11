import { buildRssFeed } from '@/lib/blog/rss'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildRssFeed('vi'), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
