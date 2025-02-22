export default function randomNote(availableNotes: string[]) {
  return availableNotes[Math.floor(Math.random() * availableNotes.length)]
}
