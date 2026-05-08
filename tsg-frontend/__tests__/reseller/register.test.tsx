import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/reseller/(auth)/register/page'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  jest.clearAllMocks()
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
})

it('renders the registration form fields', () => {
  render(<RegisterPage />)
  expect(screen.getByPlaceholderText(/voornaam/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/achternaam/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/bedrijf/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument()
})

it('shows success message after submission', async () => {
  mockFetch.mockResolvedValue({ ok: true })
  render(<RegisterPage />)
  await userEvent.type(screen.getByPlaceholderText(/voornaam/i), 'Jan')
  await userEvent.type(screen.getByPlaceholderText(/achternaam/i), 'Smit')
  await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'jan@voorbeeld.nl')
  fireEvent.click(screen.getByRole('button', { name: /aanvragen/i }))
  await waitFor(() => expect(screen.getByText(/aanvraag ontvangen/i)).toBeInTheDocument())
})

it('calls POST /auth/register-application with form data', async () => {
  mockFetch.mockResolvedValue({ ok: true })
  render(<RegisterPage />)
  await userEvent.type(screen.getByPlaceholderText(/voornaam/i), 'Jan')
  await userEvent.type(screen.getByPlaceholderText(/achternaam/i), 'Smit')
  await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'jan@voorbeeld.nl')
  fireEvent.click(screen.getByRole('button', { name: /aanvragen/i }))
  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/auth/register-application',
      expect.objectContaining({ method: 'POST' })
    )
  })
})
