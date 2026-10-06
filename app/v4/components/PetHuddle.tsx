import type { CSSProperties } from 'react'
import { V4 } from '../content'

/**
 * PetHuddle — the whole cast standing together above the headline.
 *
 * Replaces the earlier ring, which scattered the pets around a circle
 * that was half off-screen and squashed each 1088x1344 sprite into a
 * 64x64 box. Here they overlap shoulder to shoulder, tallest in the
 * middle, which is what "your whole company" is supposed to look like.
 *
 * Purely decorative, so aria-hidden with empty alt text — the headline
 * beneath already says what this means.
 *
 * Sizing is CSS's job: each pet carries its distance from the centre as
 * --d (0 for byte, rising to 3 at the edges) and v4.css derives height,
 * opacity and overlap from it. That keeps the arrangement symmetric by
 * construction rather than by seven hand-tuned numbers.
 */
export default function PetHuddle() {
  const centre = (V4.pets.length - 1) / 2

  return (
    <div className="v4-huddle" aria-hidden="true">
      {V4.pets.map((pet, i) => (
        <img
          key={pet.src}
          className="v4-huddle-pet"
          src={pet.src}
          alt=""
          style={{ ['--d']: Math.abs(i - centre) } as CSSProperties}
        />
      ))}
    </div>
  )
}
