export interface Reseller {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  company: string | null
  phone: string | null
  country: string | null
  tier: 'pearl' | 'rose' | 'pro' | 'elite' | 'black'
  is_admin: boolean
  status: 'pending' | 'active' | 'inactive'
}

export interface ResellerStats {
  revenue_ytd_eur: number
  orders_ytd: number
  discount_pct: number
  next_tier_gap_eur: number | null
  next_tier: string | null
}

export interface TierInfo {
  current_tier: string
  discount_pct: number
  benefits: string[]
  next_tier: string | null
  next_tier_min_eur: number | null
  revenue_ytd_eur: number
  progress_pct: number
}

export interface TierThreshold {
  tier: string
  min_revenue_eur: number
  discount_pct: number
  benefits: string[]
}

export interface Product {
  id: string
  wc_product_id: number | null
  name: string
  tag: string | null
  list_price_eur: number
  net_price_eur: number
  active: boolean
  sort_order: number
}

export interface Quotation {
  id: string
  tl_quotation_id: string | null
  tl_deal_id: string | null
  reseller_id: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  total_eur: number | null
  created_at: string
  updated_at: string
  line_items: { product_id: string; quantity: number; unit_price?: number }[]
}

export interface Invoice {
  id: string
  tl_invoice_id: string
  invoice_number: string | null
  status: 'draft' | 'outstanding' | 'paid' | 'overdue'
  total_eur: number
  invoice_date: string | null
  due_date: string | null
}

export interface MarketingFile {
  id: string
  name: string
  blob_url: string
  min_tier: 'all' | 'rose' | 'pro' | 'elite' | 'black'
  download_count: number
  uploaded_by: string | null
}

export interface FileListOut {
  accessible: MarketingFile[]
  locked: MarketingFile[]
}

export interface Application {
  id: string
  first_name: string
  last_name: string
  company: string
  email: string
  phone: string | null
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  assigned_tier: string
  created_at: string
}

export interface AdminReseller extends Reseller {
  revenue_ytd_eur: number
  tier_override: boolean
}
