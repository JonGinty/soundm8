import { describe, it, expect, vi, afterEach } from 'vitest'
import randomNote from './randomNote'

describe('randomNote', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the only note when there is exactly one', () => {
    expect(randomNote(['C4'])).toBe('C4')
  })

  it('always returns a note that exists in the input array', () => {
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4']
    for (let i = 0; i < 50; i++) {
      expect(notes).toContain(randomNote(notes))
    }
  })

  it('picks the first note when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(randomNote(['C4', 'D4', 'E4'])).toBe('C4')
  })

  it('picks the last note when Math.random returns just under 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999)
    expect(randomNote(['C4', 'D4', 'E4'])).toBe('E4')
  })
})
