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

test('offers one action, twice — and never a second kind of action', () => {
  render(<V4Page />)
  const fields = screen.getAllByPlaceholderText(V4.emailPlaceholder)
  const buttons = screen.getAllByRole('button')
  // The page scrolls, so the CTA repeats at the end the way Netflix's
  // signup page does. Two instances of the SAME action, never two
  // different ones — a second kind of button would be a second decision.
  expect(fields).toHaveLength(2)
  expect(buttons).toHaveLength(2)
  buttons.forEach((b) => expect(b).toHaveTextContent(V4.ctaLabel))
})

test('the two email fields have distinct ids', () => {
  render(<V4Page />)
  const ids = screen.getAllByPlaceholderText(V4.emailPlaceholder).map((f) => f.id)
  // Duplicate ids would break the <label for> on one of them.
  expect(new Set(ids).size).toBe(ids.length)
  ids.forEach((id) => expect(id).toBeTruthy())
})

test('lays out the five stages, in order, as an ordered list', () => {
  const { container } = render(<V4Page />)
  const items = container.querySelectorAll('.v4-stages > li')
  expect(items).toHaveLength(5)
  // The order IS the meaning, so assert the sequence rather than just
  // that each stage appears somewhere.
  const labels = [...container.querySelectorAll('.v4-stage-label')].map((h) => h.textContent)
  expect(labels).toEqual(V4.stages.map((s) => s.label))
  const nums = [...container.querySelectorAll('.v4-stage-num')].map((n) => n.textContent)
  expect(nums).toEqual(['01', '02', '03', '04', '05'])
  V4.stages.forEach((s) => expect(screen.getByText(s.note)).toBeInTheDocument())
  // An <ol>, not a <ul> — the numbering is semantic, not decoration.
  expect(container.querySelector('.v4-stages')?.tagName).toBe('OL')
})

test('the stage copy matches the full site, word for word', () => {
  render(<V4Page />)
  // These five notes are lifted from JOURNEY.phases in app/v3/content.ts.
  // If the site rewrites them, this should be updated deliberately.
  expect(V4.stages.map((s) => `${s.label}: ${s.note}`)).toEqual([
    'Find: Validate the idea',
    'Build: Shape the product',
    'Ship: Make it shippable',
    'Launch: Run the closed beta',
    'Run & grow: Distribute & scale',
  ])
})

test('answers every FAQ question, with the answers in the DOM when collapsed', () => {
  const { container } = render(<V4Page />)
  expect(container.querySelectorAll('.v4-faq-item')).toHaveLength(V4.faq.length)
  V4.faq.forEach((item) => {
    expect(screen.getByText(item.q)).toBeInTheDocument()
    // <details> keeps the answer rendered while closed, which is what
    // lets search engines read it.
    expect(screen.getByText(item.a)).toBeInTheDocument()
  })
})

test('closes on the same ask it opened with', () => {
  render(<V4Page />)
  expect(screen.getByText(V4.closingHeading)).toBeInTheDocument()
  expect(screen.getByText(V4.closingSub)).toBeInTheDocument()
})

test('has exactly one h1', () => {
  render(<V4Page />)
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
})
