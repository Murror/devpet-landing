import { render, screen } from '@testing-library/react'
import V4Page from '@/app/v4/page'
import { V4 } from '@/app/v4/content'

test('renders the full headline with the accent as a separate element', () => {
  const { container } = render(<V4Page />)
  // SplitText breaks the lead into per-word spans with NO text node
  // between them (the gap is CSS margin-right on .v3-word, not a
  // literal space character) — the same technique Journey.tsx,
  // DeptGallery.tsx and Loop.tsx already rely on. So a literal spaced
  // substring never appears in textContent; assert word-by-word on the
  // rendered .v3-word spans instead.
  const words = Array.from(container.querySelectorAll('.v4-headline .v3-word')).map(
    (w) => w.textContent,
  )
  expect(words).toEqual(["Let's", 'build', 'your'])
  const accent = container.querySelector('.v4-headline em')
  expect(accent).toHaveTextContent('whole company')
})

test('bridges to the full site at /v3', () => {
  render(<V4Page />)
  const bridge = screen.getByRole('link', { name: /see what we're building/i })
  expect(bridge).toHaveAttribute('href', '/v3')
})

test('renders all five social links with their real URLs', () => {
  render(<V4Page />)
  V4.socials.forEach((s) => {
    expect(screen.getByRole('link', { name: s.label })).toHaveAttribute('href', s.href)
  })
})

test('shows the timing line and the waitlist field', () => {
  render(<V4Page />)
  expect(screen.getByText('Launching this autumn')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument()
})

test('has exactly one h1', () => {
  render(<V4Page />)
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})
