import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { renderMantine } from '../../utils/test-utils'
import synthesize from '../../engine/audio/synthesize'
import MidiInputTest from './MidiInputTest'

vi.mock('../../engine/audio/synthesize', () => ({
  default: vi.fn().mockResolvedValue(undefined),
}))

type TestMidiInput = {
  onmidimessage: ((event: { data: number[] }) => void) | null
}

const setRequestMIDIAccess = (value: unknown) => {
  Object.defineProperty(navigator, 'requestMIDIAccess', {
    configurable: true,
    value,
  })
}

afterEach(() => {
  vi.clearAllMocks()
  Reflect.deleteProperty(navigator, 'requestMIDIAccess')
})

describe('MidiInputTest', () => {
  const useMidiButton = () =>
    screen.getByRole('button', {
      name: 'Use MIDI input (requires permission)',
    })

  it('initially shows only the explicit MIDI opt-in button', () => {
    renderMantine(<MidiInputTest />)

    expect(
      screen.getByRole('button', {
        name: 'Use MIDI input (requires permission)',
      }),
    ).toBeEnabled()
    expect(
      screen.queryByText('This browser does not support Web MIDI.'),
    ).not.toBeInTheDocument()
  })

  it('shows an unsupported message after opting in when Web MIDI is unavailable', () => {
    renderMantine(<MidiInputTest />)

    fireEvent.click(useMidiButton())

    expect(
      screen.getByText('This browser does not support Web MIDI.'),
    ).toBeInTheDocument()
  })

  it('shows when MIDI works but no instruments are connected', async () => {
    setRequestMIDIAccess(
      vi.fn(() =>
        Promise.resolve({
          inputs: new Map(),
          onstatechange: null,
        }),
      ),
    )
    renderMantine(<MidiInputTest />)

    fireEvent.click(useMidiButton())

    expect(
      await screen.findByText('No MIDI instruments connected.'),
    ).toBeInTheDocument()
  })

  it('shows a connected instrument and tests played MIDI notes', async () => {
    const input: TestMidiInput = { onmidimessage: null }
    setRequestMIDIAccess(
      vi.fn(() =>
        Promise.resolve({
          inputs: new Map([['keyboard', input]]),
          onstatechange: null,
        }),
      ),
    )
    renderMantine(<MidiInputTest />)

    fireEvent.click(useMidiButton())

    expect(
      await screen.findByText('MIDI instrument connected.'),
    ).toBeInTheDocument()
    await waitFor(() => expect(input.onmidimessage).toBeTruthy())
    act(() => {
      input.onmidimessage?.({ data: [0x90, 61, 100] })
    })

    expect(await screen.findByText('Last note: C#')).toBeInTheDocument()
    expect(synthesize).toHaveBeenCalledWith('C#4', 120)
  })

  it('shows truncated access errors and logs the full error', async () => {
    const longMessage = `MIDI failed: ${'x'.repeat(300)}`
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    setRequestMIDIAccess(vi.fn(() => Promise.reject(new Error(longMessage))))
    renderMantine(<MidiInputTest />)

    fireEvent.click(useMidiButton())

    expect(await screen.findByText(/MIDI failed:/)).toHaveTextContent('...')
    expect(screen.getByText(/MIDI failed:/).textContent?.length).toBeLessThan(
      longMessage.length,
    )
    expect(consoleError).toHaveBeenCalledWith(
      'MIDI unavailable:',
      expect.any(Error),
    )
    expect(consoleError).toHaveBeenCalledWith(
      'Full MIDI error:',
      expect.any(Error),
    )
  })
})
