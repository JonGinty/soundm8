import { Note } from 'tonal'
import getAudioContext from './getAudioContext'

export default async function synthesize(
  note: string,
  duration: number,
): Promise<void> {
  const freq = Note.get(note).freq
  if (!freq) {
    throw new Error(`No frequency found for note ${note}`)
  }

  const audioCtx = getAudioContext()
  // Safari/Firefox leave the context suspended until explicitly resumed,
  // even when it was created during a user gesture
  await audioCtx.resume()

  return new Promise<void>(resolve => {
    const oscillator = audioCtx.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime) // value in hertz
    oscillator.connect(audioCtx.destination)
    oscillator.start()

    setTimeout(() => {
      oscillator.stop()
      resolve()
    }, duration)
  })
}

export async function synthesizeSequence(notes: string[], duration: number) {
  for (let i = 0; i < notes.length; i++) {
    await synthesize(notes[i], duration)
  }
}
