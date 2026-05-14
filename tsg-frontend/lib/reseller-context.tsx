'use client'
import { createContext, useContext } from 'react'
import type { Reseller } from './types'

const ResellerContext = createContext<Reseller | null>(null)

export function ResellerProvider({
  reseller,
  children,
}: {
  reseller: Reseller
  children: React.ReactNode
}) {
  return (
    <ResellerContext.Provider value={reseller}>
      {children}
    </ResellerContext.Provider>
  )
}

export function useReseller(): Reseller | null {
  return useContext(ResellerContext)
}
