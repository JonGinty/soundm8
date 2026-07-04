import { describe, expect, it, vi, afterEach } from 'vitest'
import MidiNoteController, { midiNoteNumberToName } from './MidiNoteController'

type TestMidiInput = {
  onmidimessage: ((event: { data: number[] }) => void) | null
}

type TestMidiAccess = {
  inputs: Map<string, TestMidiInput>
  onstatechange: (() => void) | null
}

const setRequestMIDIAccess = (access: TestMidiAccess) => {
  Object.defineProperty(navigator, 'requestMIDIAccess', {
    configurable: true,
    value: vi.fn(() => Promise.resolve(access)),
  })
}

afterEach(() => {
  Reflect.deleteProperty(navigator, 'requestMIDIAccess')
})

describe('MidiNoteController', () => {
  it('maps MIDI note numbers to pitch class names', () => {
    expect(midiNoteNumberToName(60)).toBe('C')
    expect(midiNoteNumberToName(61)).toBe('C#')
    expect(midiNoteNumberToName(71)).toBe('B')
    expect(midiNoteNumberToName(72)).toBe('C')
  })

  it('emits note names for note-on messages and ignores octave', async () => {
    const input: TestMidiInput = { onmidimessage: null }
    setRequestMIDIAccess({
      inputs: new Map([['keyboard', input]]),
      onstatechange: null,
    })
    const handleNote = vi.fn()
    const midi = new MidiNoteController()

    midi.onNote(handleNote)
    await midi.start()
    input.onmidimessage?.({ data: [0x90, 61, 100] })
    input.onmidimessage?.({ data: [0x90, 73, 100] })

    expect(handleNote).toHaveBeenCalledWith('C#')
    expect(handleNote).toHaveBeenCalledTimes(2)
  })

  it('ignores note-off messages and note-on messages with zero velocity', async () => {
    const input: TestMidiInput = { onmidimessage: null }
    setRequestMIDIAccess({
      inputs: new Map([['keyboard', input]]),
      onstatechange: null,
    })
    const handleNote = vi.fn()
    const midi = new MidiNoteController()

    midi.onNote(handleNote)
    await midi.start()
    input.onmidimessage?.({ data: [0x80, 60, 100] })
    input.onmidimessage?.({ data: [0x90, 60, 0] })

    expect(handleNote).not.toHaveBeenCalled()
  })

  it('attaches inputs added after MIDI access starts', async () => {
    const firstInput: TestMidiInput = { onmidimessage: null }
    const nextInput: TestMidiInput = { onmidimessage: null }
    const access: TestMidiAccess = {
      inputs: new Map([['first', firstInput]]),
      onstatechange: null,
    }
    setRequestMIDIAccess(access)
    const handleNote = vi.fn()
    const midi = new MidiNoteController()

    midi.onNote(handleNote)
    await midi.start()
    access.inputs.set('next', nextInput)
    access.onstatechange?.()
    nextInput.onmidimessage?.({ data: [0x90, 64, 100] })

    expect(handleNote).toHaveBeenCalledWith('E')
  })

  it('cleans up MIDI handlers when disposed', async () => {
    const input: TestMidiInput = { onmidimessage: null }
    const access: TestMidiAccess = {
      inputs: new Map([['keyboard', input]]),
      onstatechange: null,
    }
    setRequestMIDIAccess(access)
    const midi = new MidiNoteController()

    await midi.start()
    midi.dispose()

    expect(input.onmidimessage).toBeNull()
    expect(access.onstatechange).toBeNull()
  })
})
