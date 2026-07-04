import { test, expect, vi, describe } from 'vitest'
import { Scale, Interval } from 'tonal'
import nextChallenge from './nextChallenge'
import * as randomNoteModule from './randomNote'

const availableRange = (low: string, high: string) =>
  Scale.rangeOf('C major')(low, high).filter(
    (n): n is string => n !== undefined,
  )

const intervalNum = (a: string, b: string) =>
  Math.abs(Interval.get(Interval.distance(a, b)).num)

describe('nextChallenge', () => {
  test('returns the requested number of notes', async () => {
    const result = await nextChallenge({
      scale: 'C major',
      lowestNote: 'C4',
      highestNote: 'C5',
      noteCount: 5,
    })

    expect(result).toHaveLength(5)
  })

  test('every note falls within the requested scale range', async () => {
    const result = await nextChallenge({
      scale: 'C major',
      lowestNote: 'C4',
      highestNote: 'C5',
      noteCount: 10,
    })

    const available = availableRange('C4', 'C5')
    result.forEach(note => expect(available).toContain(note))
  })

  test('never generates a note further than maxInterval from the previous one (regression: used to silently violate this after 100 failed attempts)', async () => {
    for (let attempt = 0; attempt < 25; attempt++) {
      const result = await nextChallenge({
        scale: 'C major',
        lowestNote: 'C1',
        highestNote: 'C6',
        noteCount: 8,
        maxInterval: 3,
      })

      for (let i = 1; i < result.length; i++) {
        expect(intervalNum(result[i - 1], result[i])).toBeLessThanOrEqual(3)
      }
    }
  })

  test('does not constrain the first note in the sequence', async () => {
    const randomNoteSpy = vi.spyOn(randomNoteModule, 'default')

    await nextChallenge({
      scale: 'C major',
      lowestNote: 'C1',
      highestNote: 'C6',
      noteCount: 1,
      maxInterval: 1,
    })

    expect(randomNoteSpy).toHaveBeenCalledWith(availableRange('C1', 'C6'))
  })

  test('does not filter candidates when maxInterval is not provided', async () => {
    const randomNoteSpy = vi.spyOn(randomNoteModule, 'default')
    const available = availableRange('C1', 'C6')

    await nextChallenge({
      scale: 'C major',
      lowestNote: 'C1',
      highestNote: 'C6',
      noteCount: 4,
    })

    randomNoteSpy.mock.calls.forEach(call => {
      expect(call[0]).toEqual(available)
    })
  })
})
