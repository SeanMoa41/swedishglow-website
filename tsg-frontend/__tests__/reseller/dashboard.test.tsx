import { render, screen, waitFor } from '@testing-library/react'
import DashboardPage from '@/app/reseller/(portal)/dashboard/page'
import type { ResellerStats, TierInfo } from '@/lib/types'
import { apiJson } from '@/lib/api'

jest.mock('@/lib/api', () => ({ apiJson: jest.fn() }))

const mockApiJson = apiJson as jest.MockedFunction<typeof apiJson>

const mockStats: ResellerStats = {
  revenue_ytd_eur: 4500,
  orders_ytd: 12,
  discount_pct: 40,
  next_tier_gap_eur: 500,
  next_tier: 'Rose',
}

const mockTier: TierInfo = {
  current_tier: 'pearl',
  discount_pct: 40,
  benefits: ['Inkoopkorting 40%'],
  next_tier: 'rose',
  next_tier_min_eur: 5000,
  revenue_ytd_eur: 4500,
  progress_pct: 90,
}

beforeEach(() => {
  jest.clearAllMocks()
  mockApiJson.mockImplementation((path: string) => {
    if (path === '/resellers/me/stats') return Promise.resolve(mockStats) as any
    if (path === '/resellers/me/tier') return Promise.resolve(mockTier) as any
  })
})

it('renders revenue YTD from API', async () => {
  render(<DashboardPage />)
  await waitFor(() => expect(screen.getByText(/€\s*4\.500/)).toBeInTheDocument())
})

it('renders discount percentage', async () => {
  render(<DashboardPage />)
  await waitFor(() => expect(screen.getAllByText(/40%/)[0]).toBeInTheDocument())
})

it('renders progress toward next tier', async () => {
  render(<DashboardPage />)
  await waitFor(() => expect(screen.getByText(/Rose/)).toBeInTheDocument())
})
