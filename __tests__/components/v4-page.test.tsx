import { render, screen } from '@testing-library/react'
import V4Page from '@/app/v4/page'
import { V4 } from '@/app/v4/content'

test('renders the full headline with the accent as a separate element', () => {
  const { container } = render(<V4Page />)
  // SplitText breaks the lead into per-word spans with no text node
  // between them, so assert word by word rather than on the phrase.
  const words = [...container.querySelectorAll('.v4-headline .v3-word')].map((w) => w.textContent)
  expect(words).toEqual(V4.headlineLead.split(' '))
  expect(container.querySelector('.v4-headline em')).toHaveTextContent(V4.headlineAccent)
})

test('leads with the coming-soon label', () => {
  render(<V4Page />)
  expect(screen.getByText('Coming soon')).toBeInTheDocument()
})

test('states the value proposition — what Codepet actually is', () => {
  render(<V4Page />)
  expect(screen.getByText(V4.sub)).toBeInTheDocument()
})

test('shows the cast', () => {
  const { container } = render(<V4Page />)
  expect(container.querySelectorAll('.v4-huddle-pet')).toHaveLength(V4.pets.length)
})

test('offers no route off the page except the socials', () => {
  render(<V4Page />)
  // One screen, one action: deliberately no link to /v3 or anywhere
  // else on the site. /v3 stays indexed and in the sitemap; it is just
  // not reachable from here.
  const links = screen.getAllByRole('link')
  expect(links).toHaveLength(V4.socials.length)
  links.forEach((a) => expect(a.getAttribute('href')).toMatch(/^https?:\/\//))
})

test('renders all five social links with their real URLs', () => {
  render(<V4Page />)
  V4.socials.forEach((s) => {
    expect(screen.getByRole('link', { name: s.label })).toHaveAttribute('href', s.href)
  })
})

test('offers exactly one action: the email field', () => {
  render(<V4Page />)
  expect(screen.getByPlaceholderText(V4.emailPlaceholder)).toBeInTheDocument()
  // One screen, one job — a second button would be a second decision.
  expect(screen.getAllByRole('button')).toHaveLength(1)
})

test('has exactly one h1', () => {
  render(<V4Page />)
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})
