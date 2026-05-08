import { apiJson, ApiError } from '@/lib/api'

const mockGetSession = jest.fn()
const mockSignOut = jest.fn()

jest.mock('@/lib/supabase', () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      signOut: mockSignOut,
    },
  }),
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  jest.clearAllMocks()
  mockGetSession.mockResolvedValue({ data: { session: { access_token: 'test-token' } } })
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
})

it('adds Bearer token from session', async () => {
  mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: '1' }) })
  await apiJson('/auth/me')
  expect(mockFetch).toHaveBeenCalledWith(
    'http://localhost:8000/auth/me',
    expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
    })
  )
})

it('makes request without auth header when no session', async () => {
  mockGetSession.mockResolvedValue({ data: { session: null } })
  mockFetch.mockResolvedValue({ ok: true, status: 200, json: async () => ({}) })
  await apiJson('/auth/register-application', { method: 'POST', body: '{}' })
  const call = mockFetch.mock.calls[0][1]
  expect(call.headers.Authorization).toBeUndefined()
})

it('throws ApiError on 401 and signs out', async () => {
  mockFetch.mockResolvedValue({ ok: false, status: 401, json: async () => ({}) })
  delete (global as Record<string, unknown>).window
  await expect(apiJson('/auth/me')).rejects.toThrow(ApiError)
  expect(mockSignOut).toHaveBeenCalled()
})

it('throws ApiError on non-ok response', async () => {
  mockFetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })
  await expect(apiJson('/products')).rejects.toThrow(ApiError)
})
