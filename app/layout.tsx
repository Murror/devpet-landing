import type { Metadata } from 'next'
import { Varela_Round } from 'next/font/google'
import { LocaleProvider } from '@/lib/LocaleProvider'
import { CompanionProvider } from '@/lib/CompanionContext'
import './globals.css'

const varelaRound = Varela_Round({ weight: '400', subsets: ['latin'], variable: '--font-varela' })

export const metadata: Metadata = {
  title: 'VibeMon — Theo dõi và nâng cao kỹ năng lập trình AI',
  description: 'Bạn đồng hành AI giúp theo dõi phiên lập trình, phát triển kỹ năng, và biến sai lầm thành bài học.',
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
          <CompanionProvider>
            {children}
          </CompanionProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
