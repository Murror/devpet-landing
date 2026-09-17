// Canonical landing at `/`.
//
// The implementation lives in `app/v3/` (kept as a self-contained
// segment so we can still mount it under `/v3` if needed). Because
// Next.js App Router scopes layouts to their route segment, simply
// re-exporting `./v3/page` is NOT enough — the v3 layout's font
// variables (`--font-gsans`, `--font-playfair`) and CSS imports
// (`./v3/v3.css`, `./v3/v3-fx.css`) plus the `.v3` wrapper class
// wouldn't apply at `/`. So we replicate the v3 layout's behavior here.
import type { Metadata } from 'next'
import { Google_Sans_Flex, Playfair_Display } from 'next/font/google'
import './v3/v3.css'
import './v3/v3-fx.css'
import V3Page from './v3/page'

// Main / body font (variable). Consumed by --v3-sans in v3.css.
const gsans = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-gsans',
  display: 'swap',
})

// Italic accent for headline emphasis words. Consumed by --v3-italic.
const playfair = Playfair_Display({
  weight: ['400', '500', '600'],
  style: ['italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Codepet — AI teaches you to become a founder',
  description:
    'Run your whole company with AI, department by department. byte drafts and builds with you, and you approve every move. A free macOS app.',
}

export default function Home() {
  return (
    <div className={`v3 ${gsans.variable} ${playfair.variable}`}>
      <V3Page />
    </div>
  )
}
