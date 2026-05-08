import { middleware } from '../middleware'

const mockGetUser = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser, getSession: jest.fn().mockResolvedValue({ data: { session: { access_token: 'tok' } } }) },
  }),
}))

// Mock next/server so tests run in Node.js (no Web Request API needed)
jest.mock('next/server', () => {
  const mockResponse = (status: number, headers: Record<string, string> = {}) => ({
    status,
    headers: {
      _map: headers,
      get: (k: string) => headers[k] ?? null,
      set: (k: string, v: string) => { headers[k] = v },
    },
    cookies: { set: jest.fn(), getAll: jest.fn(() => []) },
  })

  return {
    NextResponse: {
      next: () => mockResponse(200),
      redirect: (url: URL | string) =>
        mockResponse(307, { location: typeof url === 'string' ? url : url.toString() }),
    },
    NextRequest: class {
      nextUrl: URL
      url: string
      cookies = { getAll: () => [], set: jest.fn() }
      constructor(url: URL | string) {
        this.nextUrl = typeof url === 'string' ? new URL(url) : url
        this.url = this.nextUrl.toString()
      }
    },
  }
})

function makeRequest(pathname: string) {
  const { NextRequest } = jest.requireMock('next/server')
  return new NextRequest(new URL(`http://localhost${pathname}`))
}

beforeEach(() => {
  jest.clearAllMocks()
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://supabase'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'key'
  process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8000'
})

it('allows unauthenticated access to /reseller/login', async () => {
  mockGetUser.mockResolvedValue({ data: { user: null } })
  const req = makeRequest('/reseller/login')
  const res = await middleware(req)
  expect(res.status).not.toBe(307)
})

it('redirects unauthenticated user from /reseller/dashboard to /reseller/login', async () => {
  mockGetUser.mockResolvedValue({ data: { user: null } })
  const req = makeRequest('/reseller/dashboard')
  const res = await middleware(req)
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toContain('/reseller/login')
})

it('redirects authenticated user from /reseller/login to /reseller/dashboard', async () => {
  mockGetUser.mockResolvedValue({ data: { user: { id: 'abc' } } })
  const req = makeRequest('/reseller/login')
  const res = await middleware(req)
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toContain('/reseller/dashboard')
})

it('allows authenticated user through /reseller/dashboard', async () => {
  mockGetUser.mockResolvedValue({ data: { user: { id: 'abc' } } })
  const req = makeRequest('/reseller/dashboard')
  const res = await middleware(req)
  expect(res.status).not.toBe(307)
})
