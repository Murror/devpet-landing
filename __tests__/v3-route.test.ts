import nextConfig from '@/next.config'

/**
 * /v3 is the full marketing site while the root serves the pre-launch
 * teaser. A redirect from /v3 would send visitors straight back to the
 * teaser, leaving the real site unreachable at any URL — including for
 * crawlers following the sitemap entry that points at it.
 */
test('/v3 is not redirected away', async () => {
  const redirects = await nextConfig.redirects!()
  expect(redirects.find((r) => r.source === '/v3')).toBeUndefined()
})

test('the legacy /v2 redirect and the download alias are left alone', async () => {
  const redirects = await nextConfig.redirects!()
  expect(redirects.find((r) => r.source === '/v2')).toBeDefined()
  expect(redirects.find((r) => r.source === '/download/Codepet.dmg')).toBeDefined()
})
