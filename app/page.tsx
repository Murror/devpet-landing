// Canonical landing at `/`.
//
// The implementation lives in `app/v4/` (kept as a self-contained
// segment so we can still mount it under `/v4` if needed). Because
// Next.js App Router scopes layouts to their route segment, simply
// re-exporting `./v4/page` is NOT enough — the v4 layout's font
// variables (`--font-gsans`, `--font-playfair`) and CSS imports
// (`./v3/v3.css`, `./v4/v4.css`) plus the `.v3 v4` wrapper class
// wouldn't apply at `/`. So we replicate the v4 layout's behavior here.
//
// LAUNCH DAY: reverting this commit puts app/v3 back at the root, but it
// is NOT sufficient on its own — see the launch-day checklist in
// docs/superpowers/plans/2026-09-23-prelaunch-landing.md.
import type { Metadata } from 'next'
import { Google_Sans_Flex, Playfair_Display } from 'next/font/google'
import './v3/v3.css'
import './v4/v4.css'
import V4Page from './v4/page'

// Main / body font (variable). Consumed by --v3-sans in v3.css.
const gsans = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-gsans',
  display: 'swap',
})

// Italic accent for the headline's emphasis words. Consumed by --v3-italic.
const playfair = Playfair_Display({
  weight: ['400'],
  style: ['italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Codepet — Be the first to build your whole company",
  description:
    'A macOS app where a team of AI specialists builds your product with you — engineering, product, finance. Coming soon — get early access.',
}

export default function Home() {
  return (
    <div className={`v3 v4 ${gsans.variable} ${playfair.variable}`}>
      <V4Page />
    </div>
  )
}
