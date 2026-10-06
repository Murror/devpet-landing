import type { Metadata } from 'next'
import { Google_Sans_Flex, Playfair_Display } from 'next/font/google'
import './v3.css'
import './v3-fx.css'

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

// Headings use the self-hosted pixel font (Minecraft), declared via
// @font-face in v3.css — no Google fetch needed.

// This is the full marketing site, not the pre-launch teaser — it must
// describe the product itself. Wording follows the canonical
// positioning in CLAUDE.md; it deliberately carries no "coming soon"
// or waitlist framing, which belongs only to the teaser at `/`.
export const metadata: Metadata = {
  title: 'Codepet — Build your product and your company with AI',
  description:
    'Codepet is a macOS application for founders building their own product and company. An AI cofounder and a team of specialists — engineering, product, finance — carry the work with you, from first line of code to a shipped product.',
}

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <div className={`v3 ${gsans.variable} ${playfair.variable}`}>{children}</div>
}
