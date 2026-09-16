/**
 * Where the Codepet macOS download actually comes from.
 *
 * ONE constant, imported by both `next.config.ts` (which writes the redirect) and the
 * `/download` page (which renders the button). They have to agree, and the way they stop
 * agreeing is somebody editing one of them — so there is nothing to edit twice.
 *
 * WHY A REDIRECT RATHER THAN LINKING GITHUB DIRECTLY. The button's URL is the thing we
 * print in docs, paste into chats and put on a page people bookmark. Pointing it at
 * `murror.app/download/Codepet.dmg` means the host can change — GitHub Releases today,
 * a CDN or a signed S3 URL later — without any of those going stale. It also keeps the
 * download inside our own analytics and our own domain, which matters for a `.dmg`: users
 * are being asked to run an executable, and a link that leaves the site mid-click is
 * exactly the moment that feels unsafe.
 *
 * WHY `/latest/` AND NOT A PINNED TAG. `releases/latest/download/<asset>` is GitHub's own
 * permalink to the newest release's asset. Shipping a new version is then
 * `package-macos.sh` + `release-github.sh` in the app repo; nothing here is touched, and
 * no deploy of this site is needed to ship an app update.
 *
 * This resolves to a 404 until the first release is published — `gh release list` on the
 * app repo is the check, not this file.
 */

/** The public URL the button points at. Ours, stable, never changes. */
export const DOWNLOAD_PATH = '/download/Codepet.dmg'

/** Where that path currently forwards to. Free to change; the path above is not. */
export const DOWNLOAD_TARGET =
  'https://github.com/My-Outcasts/codepet/releases/latest/download/Codepet.dmg'

/** The repo the release lives on, for the "all versions" link under the button. */
export const RELEASES_PAGE = 'https://github.com/My-Outcasts/codepet/releases'

/**
 * Minimum macOS. This is the app's deployment target (26.2) and it is genuinely
 * restrictive, so the page says it next to the button rather than letting someone
 * download 40MB to find out.
 */
export const MIN_MACOS = '26.2'
