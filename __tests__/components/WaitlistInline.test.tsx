import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WaitlistInline from '@/app/v4/components/WaitlistInline'

global.fetch = jest.fn()
afterEach(() => jest.clearAllMocks())

function fill(value: string) {
  return userEvent.setup().type(screen.getByPlaceholderText('you@email.com'), value)
}
function submit() {
  fireEvent.click(screen.getByRole('button', { name: /get early access/i }))
}

test('rejects a malformed address without calling the API', async () => {
  render(<WaitlistInline />)
  await fill('notanemail')
  submit()
  expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument()
  expect(global.fetch).not.toHaveBeenCalled()
})

test('posts email and locale to the waitlist endpoint', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true, status: 200, json: async () => ({ status: 'ok' }),
  })
  render(<WaitlistInline />)
  await fill('founder@example.com')
  submit()
  await screen.findByText("You're on the list. We'll be in touch.")
  expect(global.fetch).toHaveBeenCalledWith('/api/waitlist', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({ email: 'founder@example.com', locale: 'en' }),
  }))
})

test('treats a duplicate as success, not an error', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true, status: 200, json: async () => ({ status: 'duplicate' }),
  })
  render(<WaitlistInline />)
  await fill('founder@example.com')
  submit()
  expect(await screen.findByText("You're already on the list.")).toBeInTheDocument()
})

test('shows an error and keeps the address on a 502', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false, status: 502, json: async () => ({ error: 'Save failed' }),
  })
  render(<WaitlistInline />)
  await fill('founder@example.com')
  submit()
  expect(await screen.findByText('Something went wrong. Try again?')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('you@email.com')).toHaveValue('founder@example.com')
})

test('shows an error when the request throws', async () => {
  ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'))
  render(<WaitlistInline />)
  await fill('founder@example.com')
  submit()
  expect(await screen.findByText('Something went wrong. Try again?')).toBeInTheDocument()
})
