import { Scale, Interval } from 'tonal'
import randomNote from './randomNote'

export default async function nextChallenge(ops: NextChallengeOptions) {
  const { maxInterval } = ops
  const availableNotes = Scale.rangeOf(ops.scale)(
    ops.lowestNote,
    ops.highestNote,
  ).filter(n => n !== undefined) as string[]
  const result: string[] = []

  for (let i = 0; i < ops.noteCount; i++) {
    const previousNote = result[i - 1]
    const candidates =
      previousNote && maxInterval
        ? availableNotes.filter(n => isInRange(previousNote, n, maxInterval))
        : availableNotes

    result.push(randomNote(candidates.length ? candidates : availableNotes))
  }

  return result
}

function isInRange(lastNote: string, thisNote: string, maxInterval: number) {
  const interval = Interval.distance(lastNote, thisNote)
  const distance = Math.abs(Interval.get(interval).num)
  return distance <= maxInterval
}

export type NextChallengeOptions = {
  scale: string
  lowestNote: string
  highestNote: string
  noteCount: number
  maxInterval?: number
}
