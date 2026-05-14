import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '@/lib/cart-context'
import React from 'react'

beforeEach(() => localStorage.clear())

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(CartProvider, null, children)

test('starts empty', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  expect(result.current.items).toEqual([])
  expect(result.current.totalItems).toBe(0)
  expect(result.current.totalEur).toBe(0)
})

test('addItem adds a new item with qty 1', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
  })
  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0]).toEqual({ product_id: 'p1', name: 'Test', unit_price: 10, quantity: 1 })
})

test('addItem increments quantity if product already in cart', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
  })
  expect(result.current.items).toHaveLength(1)
  expect(result.current.items[0].quantity).toBe(2)
})

test('removeItem removes an item', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.removeItem('p1')
  })
  expect(result.current.items).toHaveLength(0)
})

test('updateQty changes item quantity', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.updateQty('p1', 5)
  })
  expect(result.current.items[0].quantity).toBe(5)
})

test('updateQty(id, 0) removes the item', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.updateQty('p1', 0)
  })
  expect(result.current.items).toHaveLength(0)
})

test('clearCart empties the cart', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'Test', unit_price: 10 })
    result.current.clearCart()
  })
  expect(result.current.items).toHaveLength(0)
})

test('totalItems is sum of quantities', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'A', unit_price: 10 })
    result.current.addItem({ product_id: 'p2', name: 'B', unit_price: 20 })
    result.current.updateQty('p1', 3)
  })
  expect(result.current.totalItems).toBe(4)
})

test('totalEur is sum of unit_price * quantity', () => {
  const { result } = renderHook(() => useCart(), { wrapper })
  act(() => {
    result.current.addItem({ product_id: 'p1', name: 'A', unit_price: 10 })
    result.current.updateQty('p1', 3)
    result.current.addItem({ product_id: 'p2', name: 'B', unit_price: 20 })
  })
  expect(result.current.totalEur).toBe(50)
})
