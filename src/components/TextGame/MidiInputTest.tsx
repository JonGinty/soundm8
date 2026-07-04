import { Alert, Button, Group, Input, Stack, Text } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import synthesize from '../../engine/audio/synthesize'
import MidiNoteController from '../../engine/midi/MidiNoteController'

type MidiStatus =
  | { type: 'idle' }
  | { type: 'checking' }
  | { type: 'unsupported'; message: string }
  | { type: 'error'; message: string }
  | { type: 'ready'; inputCount: number; lastNote: string | null }

type MidiNavigator = Navigator & {
  requestMIDIAccess?: unknown
}

const MAX_ERROR_LENGTH = 220

const formatMidiError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  if (message.length <= MAX_ERROR_LENGTH) return message

  console.error('Full MIDI error:', error)
  return `${message.slice(0, MAX_ERROR_LENGTH)}...`
}

const hasMidiSupport = () =>
  typeof (navigator as MidiNavigator).requestMIDIAccess === 'function'

const MidiInputTest = () => {
  const midiRef = useRef<MidiNoteController | null>(null)
  const [status, setStatus] = useState<MidiStatus>({ type: 'idle' })

  useEffect(() => {
    return () => {
      midiRef.current?.dispose()
    }
  }, [])

  const testMidi = async () => {
    midiRef.current?.dispose()

    if (!hasMidiSupport()) {
      setStatus({
        type: 'unsupported',
        message: 'This browser does not support Web MIDI.',
      })
      return
    }

    const midi = new MidiNoteController()
    midiRef.current = midi
    setStatus({ type: 'checking' })

    midi.onInputChange(inputCount => {
      setStatus(current => ({
        type: 'ready',
        inputCount,
        lastNote: current.type === 'ready' ? current.lastNote : null,
      }))
    })

    midi.onNote(note => {
      setStatus(current => ({
        type: 'ready',
        inputCount: current.type === 'ready' ? current.inputCount : 1,
        lastNote: note,
      }))

      synthesize(`${note}4`, 120).catch(error => {
        console.error('Error playing MIDI test note:', error)
      })
    })

    const result = await midi.start()
    if (!result.supported) {
      console.error('MIDI unavailable:', result.error)
      setStatus({ type: 'error', message: formatMidiError(result.error) })
      return
    }

    setStatus({
      type: 'ready',
      inputCount: result.inputCount,
      lastNote: null,
    })
  }

  return (
    <Input.Wrapper label="MIDI controller">
      <Stack gap="xs">
        <Group>
          <Button
            variant="subtle"
            onClick={testMidi}
            loading={status.type === 'checking'}
          >
            Use MIDI input (requires permission)
          </Button>
          {status.type === 'ready' && status.inputCount > 0 && (
            <Text size="sm">
              {status.inputCount === 1
                ? 'MIDI instrument connected.'
                : `${status.inputCount} MIDI instruments connected.`}
            </Text>
          )}
        </Group>
        {status.type === 'unsupported' && (
          <Alert color="red">{status.message}</Alert>
        )}
        {status.type === 'error' && <Alert color="red">{status.message}</Alert>}
        {status.type === 'ready' && status.inputCount === 0 && (
          <Alert color="yellow">No MIDI instruments connected.</Alert>
        )}
        {status.type === 'ready' && status.inputCount > 0 && (
          <Text size="sm">
            {status.lastNote
              ? `Last note: ${status.lastNote}`
              : 'Play a note to test input.'}
          </Text>
        )}
      </Stack>
    </Input.Wrapper>
  )
}

export default MidiInputTest
