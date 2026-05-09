'use client'
import { createClient } from './supabase'

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const isLocalDev = process.env.NEXT_PUBLIC_DEV_BYPASS === 'true'

  let authHeader: Record<string, string> = {}
  if (!isLocalDev) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      authHeader = { Authorization: `Bearer ${session.access_token}` }
    }
  }

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options?.headers,
    },
  })

  if (!isLocalDev && res.status === 401) {
    const supabase = createClient()
    await supabase.auth.signOut()
    if (typeof window !== 'undefined') {
      window.location.href = '/reseller/login'
    }
    throw new ApiError(401, 'Session expired')
  }

  return res
}

export async function apiJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await apiFetch(path, options)
  if (!res.ok) throw new ApiError(res.status, `API error ${res.status}`)
  return res.json() as Promise<T>
}
