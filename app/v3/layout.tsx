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

export const metadata: Metadata = {
  title: 'Codepet — AI teaches you to become a founder',
  description:
    'Run your whole company with AI, department by department. byte drafts and builds with you, and you approve every move. A free macOS app.',
}

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <div className={`v3 ${gsans.variable} ${playfair.variable}`}>{children}</div>
}
