import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '@/lib/LocaleProvider'
import WaitlistForm from '@/components/WaitlistForm'

function renderForm() {
  return render(
    <LocaleProvider><WaitlistForm /></LocaleProvider>
  )
}

global.fetch = jest.fn()

afterEach(() => jest.clearAllMocks())

test('renders email input and submit button', () => {
  renderForm()
  expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /join waitlist/i })).toBeInTheDocument()
})

test('shows validation error for invalid email', async () => {
  const user = userEvent.setup()
  renderForm()
  await user.type(screen.getByPlaceholderText('your@email.com'), 'notanemail')
  fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
  expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument()
})

test('shows success message on 200 response', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => ({ success: true }),
  })
  const user = userEvent.setup()
  renderForm()
  await user.type(screen.getByPlaceholderText('your@email.com'), 'user@example.com')
  fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
  expect(await screen.findByText(/you're on the list/i)).toBeInTheDocument()
})

test('shows duplicate message on 409 response', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 409,
    json: async () => ({ error: 'Already on the waitlist' }),
  })
  const user = userEvent.setup()
  renderForm()
  await user.type(screen.getByPlaceholderText('your@email.com'), 'user@example.com')
  fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
  expect(await screen.findByText(/already on the list/i)).toBeInTheDocument()
})

test('shows server error message on 500 response', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 500,
    json: async () => ({ error: 'Something went wrong' }),
  })
  const user = userEvent.setup()
  renderForm()
  await user.type(screen.getByPlaceholderText('your@email.com'), 'user@example.com')
  fireEvent.click(screen.getByRole('button', { name: /join waitlist/i }))
  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
})
