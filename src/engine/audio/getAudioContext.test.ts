import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('getAudioContext', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('does not construct an AudioContext at import time', async () => {
    let constructed = 0
    class CountingAudioContext {
      constructor() {
        constructed++
      }
    }
    window.AudioContext = CountingAudioContext as unknown as typeof AudioContext

    await import('./getAudioContext')

    expect(constructed).toBe(0)
  })

  it('constructs exactly once, on first call, and reuses it after that', async () => {
    let constructed = 0
    class CountingAudioContext {
      constructor() {
        constructed++
      }
    }
    window.AudioContext = CountingAudioContext as unknown as typeof AudioContext

    const { default: getAudioContext } = await import('./getAudioContext')

    expect(constructed).toBe(0)
    const first = getAudioContext()
    expect(constructed).toBe(1)
    const second = getAudioContext()
    expect(constructed).toBe(1)
    expect(first).toBe(second)
  })
})
