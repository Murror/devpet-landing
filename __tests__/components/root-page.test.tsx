import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

test('the root serves the pre-launch teaser', () => {
  render(<Home />)
  expect(screen.getByText('Coming soon')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument()
})

test('the root still bridges to the full site', () => {
  render(<Home />)
  expect(screen.getByRole('link', { name: /see what we're building/i }))
    .toHaveAttribute('href', '/v3')
})
