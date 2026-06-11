import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Varela_Round } from 'next/font/google'
import { LocaleProvider } from '@/lib/LocaleProvider'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const varelaRound = Varela_Round({ weight: '400', subsets: ['latin'], variable: '--font-varela' })

export const viewport = {
  // viewport-fit: cover lets env(safe-area-inset-*) values
  // resolve to non-zero on iPhone notch / Dynamic Island / iPad
  // home-indicator bands. Without this, full-bleed elements
  // can't honour safe areas and content slips under the notch.
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
  // themeColor belongs in the viewport export in Next 16 (a metadata
  // export warns). Drives the browser/PWA chrome color.
  themeColor: '#1C40CF',
}

export const metadata: Metadata = {
  // Base URL so URL-based metadata (canonical, hreflang alternates, OG
  // images) in this segment and below can be authored as relative paths
  // and resolved to absolute URLs at render time.
  metadataBase: new URL(SITE_URL),
  title: 'Codepet — The AI coding school with your pet',
  description: 'Learn to vibecode with your companion. 16 skills, 4 tiers, and a pet that grows as you do.',
  // PWA manifest — installable on macOS / Windows / Android. When the
  // visitor adds Codepet to their dock or home screen, Chrome/Safari
  // open it in a standalone window with no tab bar or URL bar
  // (matches the "full website, no Google chrome" experience the
  // brand wants).
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/codepet-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/codepet-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/codepet-apple-touch-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Codepet',
  },
}
// Note: title & description are updated client-side by LocaleProvider based on detected locale

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Server-side locale detection. Vercel injects `x-vercel-ip-country`
  // on every incoming request based on the visitor's IP — we read it
  // here so the very first HTML the browser renders is already in the
  // right language. No flash of English for Vietnamese visitors.
  //
  // Falls through to 'en' on any of the failure modes:
  //   • request not from Vercel (local dev / preview without geo)
  //   • header missing / unknown country code
  //
  // Client-side `localStorage` overrides still win (user's manual
  // toggle persists across visits regardless of IP); see LocaleProvider.
  const headersList = await headers()
  const country = headersList.get('x-vercel-ip-country') ?? ''
  const initialLocale = country === 'VN' ? 'vi' : 'en'

  // Preload the critical pixel fonts so they're ready before the
  // browser parses CSS. Without these, the hero headline renders
  // in a system fallback (looks like Arial) for ~200–800ms while
  // the @font-face files download — what users were seeing as a
  // "wrong font" flash on first visit.
  //
  // We use the woff2 versions (auto-converted from the source ttf/otf
  // files) — they're 4–7× smaller than the originals, so they download
  // before the swap timeout in nearly all cases. The font-face
  // declarations in fonts.css list woff2 first with the originals as
  // fallback for any browser that doesn't speak woff2 (effectively none).
  //
  // We pick which display font to preload based on the resolved
  // initial locale so we never waste bytes on the unused one:
  //   • EN visits → preload Upheaval TT (English hero headline, 11KB)
  //   • VI visits → preload DearPix (Vietnamese hero headline, 77KB)
  // VT323 is preloaded for both since the body text uses it everywhere.
  //
  // `crossOrigin="anonymous"` is required for `as="font"` preloads
  // even when the font is same-origin (per the spec). Without it
  // browsers ignore the preload.
  const displayFontHref =
    initialLocale === 'vi'
      ? '/fonts/dearpix/dearpix.woff2'
      : '/fonts/upheaval/upheavtt.woff2'

  return (
    <html lang={initialLocale}>
      <head>
        <link
          rel="preload"
          href={displayFontHref}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vt323/VT323-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
          />
        )}
        {/* Google Analytics 4 — uses gtag.js directly (not the
            Firebase SDK) to keep the payload small. The Measurement
            ID is `G-6CBHLCG5LK` from the Codepet GA4 property in
            Firebase; hard-coded here as a fallback so any
            deployment of this codebase (Vercel project A, project
            B, or self-hosted) ships GA tracking by default without
            needing an env var configured on each platform.

            `NEXT_PUBLIC_GA_MEASUREMENT_ID` still wins when set —
            useful for: (a) overriding to a staging GA property,
            (b) setting to "disabled" to opt a preview build out,
            or (c) future re-branding without a code change. */}
        {(() => {
          const gaId =
            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-6CBHLCG5LK'
          if (gaId === 'disabled') return null
          return (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                      anonymize_ip: true,
                      cookie_flags: 'SameSite=None;Secure'
                    });
                  `,
                }}
              />
            </>
          )
        })()}
      </head>
      <body className={varelaRound.variable}>
        <LocaleProvider initialLocale={initialLocale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
