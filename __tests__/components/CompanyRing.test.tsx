import { render } from '@testing-library/react'
import CompanyRing from '@/app/v4/components/CompanyRing'
import { V4 } from '@/app/v4/content'

test('renders one node per companion, pointing at the SVG files', () => {
  const { container } = render(<CompanyRing />)
  const imgs = container.querySelectorAll('img')
  expect(imgs).toHaveLength(8)
  expect(imgs).toHaveLength(V4.companions.length)
  expect(imgs[0]).toHaveAttribute('src', '/characters/byte.svg')
})

test('is decorative and hidden from assistive tech', () => {
  const { container } = render(<CompanyRing />)
  expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  // No alt text — every image is presentational.
  container.querySelectorAll('img').forEach((img) => {
    expect(img).toHaveAttribute('alt', '')
  })
})

test('gives each node its index so CSS can place it on the circle', () => {
  const { container } = render(<CompanyRing />)
  const nodes = container.querySelectorAll<HTMLElement>('.v4-ring-node')
  expect(nodes).toHaveLength(8)
  // Read the custom property rather than string-matching the style
  // attribute — React's serialisation of custom properties isn't
  // something to assert on.
  expect(nodes[3].style.getPropertyValue('--i')).toBe('3')
})
