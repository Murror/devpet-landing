import { DOWNLOAD_TARGET } from '@/lib/download'

/**
 * The team's private download link: `/d/<token>`.
 *
 * Unlisted, not authenticated — whoever has the link can download, so share it the way you
 * would share a password. Nothing on the site links here, the token lives only in the Vercel
 * env (this repo is public, so it can never be committed), and every response is marked
 * noindex so a link pasted somewhere crawlable does not end up in search results.
 *
 *   PRIVATE_DOWNLOAD_TOKEN  required; unset means the route is off and always 404s
 *   PRIVATE_DOWNLOAD_URL    optional; where the .dmg lives. Defaults to DOWNLOAD_TARGET
 *
 * Rotating the token (change the env var, redeploy) kills every copy of the old link.
 * A wrong token is a plain 404, indistinguishable from a route that does not exist.
 */
export const dynamic = 'force-dynamic'

const NOINDEX = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' }

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const expected = process.env.PRIVATE_DOWNLOAD_TOKEN
  if (!expected || token !== expected) {
    return new Response('Not found', { status: 404, headers: NOINDEX })
  }
  const target = process.env.PRIVATE_DOWNLOAD_URL || DOWNLOAD_TARGET
  return new Response(null, { status: 307, headers: { ...NOINDEX, Location: target } })
}
