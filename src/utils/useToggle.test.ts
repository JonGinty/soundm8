import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MouseEvent } from 'react'
import useToggle, { useClickableToggle } from './useToggle'

describe('useToggle', () => {
  it('defaults to false', () => {
    const { result } = renderHook(() => useToggle())
    expect(result.current[0]).toBe(false)
  })

  it('accepts an initial state', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current[0]).toBe(true)
  })

  it('flips the value when called with no argument', () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => result.current[1]())
    expect(result.current[0]).toBe(true)

    act(() => result.current[1]())
    expect(result.current[0]).toBe(false)
  })

  it('sets an explicit boolean value regardless of the current state', () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => result.current[1](true))
    expect(result.current[0]).toBe(true)

    act(() => result.current[1](true))
    expect(result.current[0]).toBe(true)

    act(() => result.current[1](false))
    expect(result.current[0]).toBe(false)
  })
})

describe('useClickableToggle', () => {
  it('flips state when the returned handler is invoked, ignoring its event argument', () => {
    const { result } = renderHook(() => useClickableToggle(false))

    act(() => result.current[1](undefined as unknown as MouseEvent))
    expect(result.current[0]).toBe(true)

    act(() => result.current[1](undefined as unknown as MouseEvent))
    expect(result.current[0]).toBe(false)
  })
})
