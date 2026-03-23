import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LocaleProvider } from '@/lib/LocaleProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'DevPet — Level up your vibe coding',
  description: 'Your AI coding companion that tracks sessions, grows skills, and turns mistakes into lessons.',
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
      <body className={inter.variable}>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
