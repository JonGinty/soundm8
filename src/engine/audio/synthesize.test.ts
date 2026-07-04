import { describe, it, expect, vi } from 'vitest'
import synthesize, { synthesizeSequence } from './synthesize'
import getAudioContext from './getAudioContext'

describe('synthesize', () => {
  it('resumes the audio context before playing (required for Safari/Firefox autoplay policy)', async () => {
    const audioCtx = getAudioContext()
    const resumeSpy = vi.spyOn(audioCtx, 'resume')

    await synthesize('C4', 0)

    expect(resumeSpy).toHaveBeenCalled()
  })

  it('rejects for a note with no resolvable frequency', async () => {
    await expect(synthesize('not-a-note', 0)).rejects.toThrow()
  })

  it('does not resume or create an oscillator when the note is invalid', async () => {
    const audioCtx = getAudioContext()
    const resumeSpy = vi.spyOn(audioCtx, 'resume')
    const oscillatorSpy = vi.spyOn(audioCtx, 'createOscillator')

    await expect(synthesize('not-a-note', 0)).rejects.toThrow()

    expect(resumeSpy).not.toHaveBeenCalled()
    expect(oscillatorSpy).not.toHaveBeenCalled()
  })

  it('plays notes in sequence', async () => {
    const audioCtx = getAudioContext()
    const createOscillatorSpy = vi.spyOn(audioCtx, 'createOscillator')

    await synthesizeSequence(['C4', 'D4', 'E4'], 0)

    expect(createOscillatorSpy).toHaveBeenCalledTimes(3)
  })
})
