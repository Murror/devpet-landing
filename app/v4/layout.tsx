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
  title: "Codepet — Let's build your whole company",
  description:
    'Codepet is the AI cofounder for founders building their own product and company. A macOS app, launching this autumn. Join the waitlist.',
}

export default function V4Layout({ children }: { children: React.ReactNode }) {
  // Mounting inside `.v3` inherits the token scope without duplicating
  // it — the same approach BlogShell.tsx uses for the blog.
  return <div className={`v3 v4 ${gsans.variable} ${playfair.variable}`}>{children}</div>
}
