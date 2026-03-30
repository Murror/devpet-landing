import type { Metadata } from 'next'
import { Varela_Round } from 'next/font/google'
import { LocaleProvider } from '@/lib/LocaleProvider'
import './globals.css'

const varelaRound = Varela_Round({ weight: '400', subsets: ['latin'], variable: '--font-varela' })

export const metadata: Metadata = {
  title: 'CodePet — The AI coding school with your pet',
  description: 'Learn to vibecode with your companion. 16 skills, 4 tiers, and a pet that grows as you do.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className={varelaRound.variable}>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
