import { SITE_HOME } from '@/lib/site'
import { SECTIONS } from '@/app/blog/_components/BlogNav'

/**
 * Pins the fix for the finding that repointing `/` to the pre-launch
 * teaser silently severed the blog, pricing, download and setup pages
 * from the full marketing site (which now lives at /v3). A single
 * constant, SITE_HOME, controls where all of those "back to home" links
 * and nav brands point — this test asserts on the constant's value and
 * on real, imported navigation data, not on source text.
 */
test('SITE_HOME points at /v3 while the teaser owns the root', () => {
  expect(SITE_HOME).toBe('/v3')
})

test("BlogNav's section links all target SITE_HOME, not the bare root", () => {
  expect(SECTIONS.length).toBeGreaterThan(0)
  SECTIONS.forEach((section) => {
    expect(section.href.startsWith(SITE_HOME)).toBe(true)
  })
})

test('BlogNav section anchors still carry their original fragments', () => {
  const fragments = SECTIONS.map((s) => s.href.slice(SITE_HOME.length))
  expect(fragments).toEqual(['#loop', '#environment', '#departments', '#journey'])
})
