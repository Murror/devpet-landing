import sitemap from '@/app/sitemap'
import { absoluteUrl, SITE_URL } from '@/lib/site'

test('lists the full marketing site at /v3 so it stays indexed', () => {
  const urls = sitemap().map((e) => e.url)
  expect(urls).toContain(absoluteUrl('/v3'))
})

test('still lists the root and pricing', () => {
  const urls = sitemap().map((e) => e.url)
  expect(urls).toContain(SITE_URL)
  expect(urls).toContain(absoluteUrl('/pricing'))
})

test('ranks /v3 below the root but above the legal pages', () => {
  const entries = sitemap()
  const at = (url: string) => entries.find((e) => e.url === url)?.priority
  expect(at(absoluteUrl('/v3'))).toBe(0.8)
  expect(at(SITE_URL)).toBe(1)
  expect(at(absoluteUrl('/privacy'))).toBe(0.3)
})
