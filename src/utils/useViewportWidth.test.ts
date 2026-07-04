import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useViewportWidth from './useViewportWidth'

const setViewportWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

describe('useViewportWidth', () => {
  it('returns the current window width on mount', () => {
    setViewportWidth(800)
    const { result } = renderHook(() => useViewportWidth())
    expect(result.current).toBe(800)
  })

  it('updates when the window is resized', () => {
    setViewportWidth(800)
    const { result } = renderHook(() => useViewportWidth())

    setViewportWidth(1200)
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current).toBe(1200)
  })

  it('removes the resize listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useViewportWidth())

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
