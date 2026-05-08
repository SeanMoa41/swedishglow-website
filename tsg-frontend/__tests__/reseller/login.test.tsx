import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/reseller/(auth)/login/page'

const mockSignIn = jest.fn()
const mockPush = jest.fn()

jest.mock('@/lib/supabase', () => ({
  createClient: () => ({
    auth: { signInWithPassword: mockSignIn },
  }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: () => null }),
}))

beforeEach(() => jest.clearAllMocks())

it('renders email and password inputs', () => {
  render(<LoginPage />)
  expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/wachtwoord/i)).toBeInTheDocument()
})

it('redirects to dashboard on successful login', async () => {
  mockSignIn.mockResolvedValue({ error: null })
  render(<LoginPage />)
  await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'test@example.com')
  await userEvent.type(screen.getByPlaceholderText(/wachtwoord/i), 'password')
  fireEvent.click(screen.getByRole('button', { name: /inloggen/i }))
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/reseller/dashboard'))
})

it('shows error on failed login', async () => {
  mockSignIn.mockResolvedValue({ error: { message: 'Invalid login' } })
  render(<LoginPage />)
  await userEvent.type(screen.getByPlaceholderText(/e-mail/i), 'bad@example.com')
  await userEvent.type(screen.getByPlaceholderText(/wachtwoord/i), 'wrong')
  fireEvent.click(screen.getByRole('button', { name: /inloggen/i }))
  await waitFor(() => expect(screen.getByText(/ongeldig/i)).toBeVisible())
})
