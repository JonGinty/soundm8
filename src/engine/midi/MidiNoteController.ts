export type MidiNoteHandler = (note: string) => void
export type MidiInputChangeHandler = (inputCount: number) => void

export type MidiStartResult =
  | {
      supported: true
      inputCount: number
    }
  | {
      supported: false
      error: unknown
    }

type MidiMessageEvent = {
  data: Uint8Array | number[]
}

type MidiInput = {
  onmidimessage: ((event: MidiMessageEvent) => void) | null
}

type MidiAccess = {
  inputs: {
    values: () => IterableIterator<MidiInput>
  }
  onstatechange: (() => void) | null
}

type MidiNavigator = Navigator & {
  requestMIDIAccess?: () => Promise<MidiAccess>
}

const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]

export const midiNoteNumberToName = (noteNumber: number) =>
  NOTE_NAMES[noteNumber % NOTE_NAMES.length]

export default class MidiNoteController {
  private access: MidiAccess | null = null
  private inputs = new Set<MidiInput>()
  private handlers = new Set<MidiNoteHandler>()
  private inputChangeHandlers = new Set<MidiInputChangeHandler>()
  private disposed = false

  async start(): Promise<MidiStartResult> {
    const requestMIDIAccess = (navigator as MidiNavigator).requestMIDIAccess
    if (!requestMIDIAccess) {
      return {
        supported: false,
        error: new Error('This browser does not support Web MIDI.'),
      }
    }

    try {
      this.access = await requestMIDIAccess.call(navigator)
    } catch (error) {
      return { supported: false, error }
    }

    if (this.disposed) {
      this.detach()
      return { supported: true, inputCount: 0 }
    }

    this.attachInputs()
    this.access.onstatechange = () => {
      this.attachInputs()
      this.emitInputChange()
    }

    return { supported: true, inputCount: this.getInputCount() }
  }

  onNote(handler: MidiNoteHandler) {
    this.handlers.add(handler)

    return () => {
      this.handlers.delete(handler)
    }
  }

  onInputChange(handler: MidiInputChangeHandler) {
    this.inputChangeHandlers.add(handler)

    return () => {
      this.inputChangeHandlers.delete(handler)
    }
  }

  dispose() {
    this.disposed = true
    this.detach()
  }

  private attachInputs() {
    if (!this.access) return

    for (const input of this.access.inputs.values()) {
      if (this.inputs.has(input)) continue

      input.onmidimessage = event => this.handleMessage(event)
      this.inputs.add(input)
    }
  }

  private detach() {
    for (const input of this.inputs) {
      input.onmidimessage = null
    }

    if (this.access) {
      this.access.onstatechange = null
    }

    this.inputs.clear()
    this.handlers.clear()
    this.inputChangeHandlers.clear()
  }

  private handleMessage(event: MidiMessageEvent) {
    const [status, noteNumber, velocity] = event.data
    const command = status & 0xf0
    const isNoteOn = command === 0x90 && velocity > 0

    if (!isNoteOn) return

    const note = midiNoteNumberToName(noteNumber)
    this.handlers.forEach(handler => handler(note))
  }

  private getInputCount() {
    if (!this.access) return 0

    return Array.from(this.access.inputs.values()).length
  }

  private emitInputChange() {
    const inputCount = this.getInputCount()
    this.inputChangeHandlers.forEach(handler => handler(inputCount))
  }
}
