import { Interval } from 'tonal'

export default function calculateLedgerLines(
  note: string,
  clef: 'treble' | 'bass',
) {
  //if (clef === "treble") return calculateTrebleClefLedgerLines(note);
  const top = clef === 'treble' ? 'G5' : 'B3'
  const bottom = clef === 'treble' ? 'D4' : 'F2'

  let interval = getNoteInterval(top, note)
  if (interval > 0) return Math.floor(interval / 2) // off the top
  interval = getNoteInterval(bottom, note)
  if (interval > 0) return 0 // no ledger lines
  return Math.floor(Math.abs(interval) / 2)
}

function getNoteInterval(left: string, right: string): number {
  return Interval.get(Interval.distance(left, right)).num
}
