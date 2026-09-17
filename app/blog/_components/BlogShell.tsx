import type { ReactNode } from 'react'
import { Google_Sans_Flex, Playfair_Display } from 'next/font/google'
import type { Locale } from '@/lib/site'
import Atmosphere from '../../v3/components/Atmosphere'
import BlogNav from './BlogNav'
import BlogFooter from './BlogFooter'
import BlogLangSync from './BlogLangSync'
import '../../v3/v3.css'
import '../../v3/v3-fx.css'
import '../blog.css'

// Fonts + theme are set up here (not in the route layout) because BOTH the
// English `/blog` and the Vietnamese `/vi/blog` segments render through
// BlogShell — keeping it here is the single source that styles both.
// Google Sans Flex (body + headings), Playfair Display Italic (accents),
// and the self-hosted Minecraft pixel face (declared in v3.css).
const gsans = Google_Sans_Flex({
  subsets: ['latin'],
  variable: '--font-gsans',
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['400', '500', '600'],
  style: ['italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

/**
 * Page chrome shared by every blog route. Mounts the blog inside the
 * site's cinematic-dark `.v3` scope (dark tokens + dark document root),
 * paints the atmosphere (drifting nebula + film grain, reused from the
 * landing), and hangs the frosted pill nav + dark footer around a
 * `.bx-root` reading surface. `altHref` is the equivalent page in the
 * other locale, used by the nav's language switch.
 */
export default function BlogShell({
  locale,
  altHref,
  children,
}: {
  locale: Locale
  altHref: string
  children: ReactNode
}) {
  return (
    <div className={`v3 blogx ${gsans.variable} ${playfair.variable}`}>
      <BlogLangSync locale={locale} />
      <Atmosphere />
      <BlogNav locale={locale} altHref={altHref} />
      <div className="bx-root">{children}</div>
      <BlogFooter locale={locale} />
    </div>
  )
}
