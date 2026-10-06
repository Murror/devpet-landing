import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

test('the root serves the pre-launch teaser', () => {
  render(<Home />)
  expect(screen.getByText('Coming soon')).toBeInTheDocument()
  expect(screen.getAllByPlaceholderText('you@email.com')).toHaveLength(2)
})

test('the root offers one action and no way to wander off it', () => {
  render(<Home />)
  expect(screen.queryByRole('link', { name: /see what we're building/i })).toBeNull()
  // Two instances of the same CTA (hero and closing), no other buttons.
  const buttons = screen.getAllByRole('button')
  expect(buttons).toHaveLength(2)
  buttons.forEach((b) => expect(b).toHaveTextContent('Get early access'))
  // Every link leaves the site; none navigates within it.
  screen.getAllByRole('link').forEach((a) => {
    expect(a.getAttribute('href')).toMatch(/^https?:\/\//)
  })
})
