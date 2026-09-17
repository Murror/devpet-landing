import type { CSSProperties } from 'react'

/**
 * PetBand — the full pixel-pet cast lined up in the glow band just above the
 * marquee. Charming "meet the crew" moment between the hero and the ticker.
 * Each pet bobs on its own offset so the row feels alive.
 */
const PETS = [
  '/v2/pets/1-pink-bear.png',
  '/v2/pets/2-green-owl.png',
  '/v2/pets/3-orange-fox.png',
  '/v2/pets/4-purple-byte.png',
  '/v2/pets/5-yellow-bear.png',
  '/v2/pets/6-red-bear.png',
  '/v2/pets/7-blue-penguin.png',
]

export default function PetBand() {
  return (
    <div className="v3-petband" aria-hidden="true">
      {PETS.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          className="v3-pet v3-petband-pet"
          src={src}
          alt=""
          style={{ ['--i']: i } as CSSProperties}
        />
      ))}
    </div>
  )
}
