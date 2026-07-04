let audioContext: AudioContext | undefined

export default function getAudioContext(): AudioContext {
  if (!audioContext) {
    // must be constructed lazily: browsers keep an AudioContext suspended
    // unless it's created (or resumed) inside a user-gesture call stack
    audioContext = new AudioContext()
  }
  return audioContext
}
