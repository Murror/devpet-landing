import { render } from '@testing-library/react'
import PetHuddle from '@/app/v4/components/PetHuddle'
import { V4 } from '@/app/v4/content'

test('renders the whole cast from the site pet sprites', () => {
  const { container } = render(<PetHuddle />)
  const imgs = container.querySelectorAll('img')
  expect(imgs).toHaveLength(V4.pets.length)
  // The live site's pets live in /v2/pets — NOT public/characters, which
  // is a different, taller set the teaser must not use.
  imgs.forEach((img) => {
    expect(img.getAttribute('src')).toMatch(/^\/v2\/pets\//)
  })
})

test('puts byte in the middle', () => {
  const { container } = render(<PetHuddle />)
  const imgs = container.querySelectorAll<HTMLImageElement>('img')
  const middle = imgs[Math.floor(imgs.length / 2)]
  expect(middle.getAttribute('src')).toContain('purple-byte')
})

test('is decorative and hidden from assistive tech', () => {
  const { container } = render(<PetHuddle />)
  expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  container.querySelectorAll('img').forEach((img) => {
    expect(img).toHaveAttribute('alt', '')
  })
})

test('gives each pet a symmetric distance from the centre', () => {
  const { container } = render(<PetHuddle />)
  const d = [...container.querySelectorAll<HTMLElement>('.v4-huddle-pet')].map((el) =>
    Number(el.style.getPropertyValue('--d')),
  )
  // Seven pets -> 3,2,1,0,1,2,3. The centre is 0 and the ends match,
  // which is what keeps the huddle symmetric without hand-tuned sizes.
  expect(d[Math.floor(d.length / 2)]).toBe(0)
  expect(d).toEqual([...d].reverse())
  expect(Math.max(...d)).toBe((V4.pets.length - 1) / 2)
})
