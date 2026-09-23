import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

test('the root serves the pre-launch teaser', () => {
  render(<Home />)
  expect(screen.getByText('Coming soon')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument()
})

test('the root offers one action and no way to wander off it', () => {
  render(<Home />)
  expect(screen.queryByRole('link', { name: /see what we're building/i })).toBeNull()
  expect(screen.getAllByRole('button')).toHaveLength(1)
})
