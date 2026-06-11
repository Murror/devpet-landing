import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Dynamic Open Graph image for blog pages: GET /blog/og?title=…&lang=…&category=…
 *
 * Returns a 1200×630 branded card with the article title. Rendered on
 * the Node runtime (not edge) so it can read a bundled font. We use the
 * static PP Neue Montreal OTF — satori (which powers ImageResponse)
 * fails to parse variable fonts, so a static face is required. Wrapped
 * in try/catch so a font/render hiccup degrades to a plain branded card
 * rather than handing social scrapers a 500.
 */
export const runtime = 'nodejs'

const SIZE = { width: 1200, height: 630 }

function clamp(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1).trimEnd()}…`
}

function card(title: string, category: string, font?: ArrayBuffer | Buffer) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background:
            'linear-gradient(135deg, #2D2466 0%, #534AB7 60%, #7B6DC8 100%)',
          color: '#ffffff',
          fontFamily: font ? 'Display' : undefined,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: 56,
              height: 70,
              background: '#ffffff',
              color: '#2D2466',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 700 }}>
            Codepet&nbsp;<span style={{ opacity: 0.7 }}>&nbsp;/ Blog</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {category ? (
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#C9BEF7',
                display: 'flex',
              }}
            >
              {category}
            </div>
          ) : null}
          <div
            style={{
              fontSize: title.length > 60 ? 58 : 72,
              fontWeight: 700,
              lineHeight: 1.1,
              display: 'flex',
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{ fontSize: 26, color: 'rgba(255,255,255,0.8)', display: 'flex' }}
        >
          code-pet.com
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: font
        ? [{ name: 'Display', data: font, weight: 700, style: 'normal' }]
        : [],
    }
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = clamp(searchParams.get('title') || 'The Codepet Blog', 110)
  const category = searchParams.get('category') || ''

  try {
    const font = await readFile(
      join(process.cwd(), 'public/fonts/pp-neue-montreal/ppneuemontreal-bold.otf')
    )
    return card(title, category, font)
  } catch {
    // Last-resort: render with satori's built-in font so scrapers still
    // get a valid image even if the bundled font can't be read/parsed.
    return card(title, category)
  }
}
