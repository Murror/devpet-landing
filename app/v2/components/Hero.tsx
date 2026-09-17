'use client'

import Image from 'next/image'
import { useLocale } from '@/lib/LocaleProvider'

/**
 * Hero — Section 2 of the /v2 landing.
 *
 * Layout (top → bottom, all centered — matches Framer Hero spec):
 *   1. Display headline: "LEARN TO BUILD / AGENTIC CODE"
 *      (PP Neue Montreal Bold 700, 160px, tracking -0.04em, uppercase
 *      applied via CSS text-transform so the JSX source stays readable)
 *   2. Upright subhead: "with your crew"
 *      (PP Neue Montreal Medium 500, 100px, -0.04em, #B0B0B0 grey)
 *   3. Pet row: 7 pixel-art companions, pixelated rendering, slight
 *      size variation so the silhouette isn't a flat bar
 *   4. Pixel-pill CTA: "Start Your Journey" (links to waitlist) —
 *      black bg, white border, Minecraft font
 *
 * Pet SVGs live in /public/v2/pets/ — each is pixel-art authored on
 * a 16-unit grid with integer-aligned rects, so they render crisp at
 * any size without needing bitmap scaling tricks. `unoptimized` on
 * next/image skips the optimizer since we want the raw SVG served.
 */

// Left-to-right order matches the Framer hero composition.
// Each pet gets a per-slot modifier so the row has varied sizes
// AND varied vertical offsets — matches the Framer staggered
// baseline where some pets sit higher and others lower rather
// than all flush to the same line.
const pets = [
  { src: '/v2/pets/1-pink-bear.png',    alt: 'Pink bear companion',    className: 'v2-hero-pet v2-hero-pet--pink'    },
  { src: '/v2/pets/2-green-owl.png',    alt: 'Green owl companion',    className: 'v2-hero-pet v2-hero-pet--owl'     },
  { src: '/v2/pets/3-orange-fox.png',   alt: 'Orange fox companion',   className: 'v2-hero-pet v2-hero-pet--fox'     },
  { src: '/v2/pets/4-purple-byte.png',  alt: 'Byte, purple companion', className: 'v2-hero-pet v2-hero-pet--byte'    },
  { src: '/v2/pets/5-yellow-bear.png',  alt: 'Yellow bear companion',  className: 'v2-hero-pet v2-hero-pet--yellow'  },
  { src: '/v2/pets/6-red-bear.png',     alt: 'Red bear companion',     className: 'v2-hero-pet v2-hero-pet--red'     },
  { src: '/v2/pets/7-blue-penguin.png', alt: 'Blue penguin companion', className: 'v2-hero-pet v2-hero-pet--penguin' },
] as const

export default function Hero() {
  const { t } = useLocale()
  return (
    <section id="hero" className="v2-hero">
      {/* Flanking pixel-art decorations — sparkle on the left,
          heart on the right. Each is a wrapper <div> (drop-in
          stagger + static rotation) around an <Image> (continuous
          idle bob). Two layers so the two transforms don't fight.
          aria-hidden keeps them invisible to screen readers. */}
      <div className="v2-hero-deco v2-hero-deco--sparkle-tl" aria-hidden="true">
        <Image
          src="/v2/hero-deco/sparkle.png"
          alt=""
          width={133}
          height={120}
          className="v2-hero-deco-img"
          unoptimized
        />
      </div>
      <div className="v2-hero-deco v2-hero-deco--heart-tr" aria-hidden="true">
        <Image
          src="/v2/hero-deco/heart.png"
          alt=""
          width={60}
          height={60}
          className="v2-hero-deco-img"
          unoptimized
        />
      </div>

      <h1 className="v2-hero-headline">
        <span className="line">{t.v2.hero.titleLine1}</span>
        {/* titleLine2 renders only when the locale provides a value.
            Vietnamese collapses the whole headline onto titleLine1
            ("Học cách lập trình agentic") and leaves titleLine2 as
            "", so this gate prevents a stray empty line. */}
        {t.v2.hero.titleLine2 && (
          <span className="line">{t.v2.hero.titleLine2}</span>
        )}
      </h1>

      <p className="v2-hero-subhead">{t.v2.hero.subhead}</p>

      <div className="v2-hero-pets" role="presentation">
        {/* Three nested layers per pet so the V-offset, the idle
            bob loop, and the hover scale can each own their own
            transform without fighting each other:
              outer  .v2-hero-pet        → static V-offset (per slot)
              middle .v2-hero-pet-bob    → continuous bob/sway loop
              inner  .v2-hero-pet-img    → hover scale pop */}
        {pets.map((pet) => (
          <div key={pet.src} className={pet.className}>
            <div className="v2-hero-pet-bob">
              <Image
                src={pet.src}
                alt={pet.alt}
                width={170}
                height={220}
                className="v2-hero-pet-img"
                priority
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile-only "Start your journey" CTA, placed under the pets row.
          On tablet/desktop the nav CTA is visible at the top right; on
          phones the nav CTA shrinks (768) or hides (480), so we surface
          a clear in-flow CTA here instead. Reuses the nav CTA's pixel-
          pill classes for the body styling — see fonts.css for the
          mobile-only show rules. */}
      <a
        href="#product"
        className="v2-hero-mobile-cta"
        aria-label={t.v2.nav.startJourney}
      >
        <span className="v2-hero-mobile-cta-body">{t.v2.nav.startJourney}</span>
      </a>
    </section>
  )
}
