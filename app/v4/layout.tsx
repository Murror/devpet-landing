import type { Metadata } from 'next'
import { Google_Sans_Flex, Playfair_Display } from 'next/font/google'
// Tokens only. v3-fx.css is deliberately NOT imported — it is 1,104
// lines of dept tilt, copilot and Lenis machinery this page never uses.
import '../v3/v3.css'
import './v4.css'

const gsans = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-gsans',
  display: 'swap',
})

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
  // /v4 and / render the same page while the teaser is live. Keep the
  // segment reachable for review but out of the index, so it can't
  // compete with the root or linger as a stale "Launching this autumn"
  // page after launch.
  robots: { index: false, follow: true },
}

export default function V4Layout({ children }: { children: React.ReactNode }) {
  // Mounting inside `.v3` inherits the token scope without duplicating
  // it — the same approach BlogShell.tsx uses for the blog.
  return <div className={`v3 v4 ${gsans.variable} ${playfair.variable}`}>{children}</div>
}
