import { useState, useEffect, useRef } from 'react'
import { TextInput, Button } from '@mantine/core'
import { TextGameInputMode } from './TextGame.settings'
import useViewportWidth from '../../utils/useViewportWidth'

type NoteInputProps = {
  handleGuess: (guess: string) => void
  inputMode: TextGameInputMode
}

const NoteInput = (props: NoteInputProps) =>
  props.inputMode === 'text' ? (
    <TextNoteInput {...props}></TextNoteInput>
  ) : (
    <PianoNoteInput {...props}></PianoNoteInput>
  )

const TextNoteInput = ({ handleGuess }: NoteInputProps) => {
  const [input, setInput] = useState<string>('')

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
    if (value) {
      handleGuess(value)
      setInput('')
    }
  }

  return (
    <TextInput
      type="text"
      placeholder="type your answer here"
      value={input}
      onChange={onChange}
    />
  )
}

const buildKeyboard = (octaves: number) => {
  const allWhiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  const allBlackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', '']
  const whiteKeys = []
  const blackKeys = []
  for (let i = 0; i < octaves; i++) {
    whiteKeys.push(...allWhiteKeys)
    blackKeys.push(...allBlackKeys)
  }
  whiteKeys.push('C')
  return { whiteKeys, blackKeys }
}

const PianoNoteInput = ({ handleGuess, inputMode }: NoteInputProps) => {
  const [octaves, setOctaves] = useState<number>(1)
  const { whiteKeys, blackKeys } = buildKeyboard(octaves)

  const showNoteLabel = inputMode === 'keyboardletters'

  const containerRef = useRef<HTMLDivElement>(null)
  const [leftOffset, setLeftOffset] = useState<number>(0)

  const firstKeyRef = useRef<HTMLButtonElement>(null)

  const viewportWidth = useViewportWidth()

  useEffect(() => {
    const keyWidth = firstKeyRef.current?.offsetWidth || 40
    const roughKeyCount = Math.floor((viewportWidth - 600) / keyWidth)
    setOctaves(Math.max(Math.floor(roughKeyCount / 7), 1))

    const containerWidth = containerRef.current?.offsetWidth || 0
    const keyboardWidth = whiteKeys.length * keyWidth
    setLeftOffset((containerWidth - keyboardWidth) / 2)
  }, [
    containerRef.current?.offsetWidth,
    firstKeyRef.current?.offsetWidth,
    viewportWidth,
    octaves,
    whiteKeys.length
  ])

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        position: 'relative',
        height: '100px',
        left: `${leftOffset}px`,
      }}
    >
      {whiteKeys.map((note, index) => (
        <Button
          ref={index === 0 ? firstKeyRef : undefined}
          key={note + index}
          onClick={() => handleGuess(note)}
          style={{
            width: '40px',
            height: '100%',
            margin: '1px',
            backgroundColor: 'white',
            border: '1px solid black',
            zIndex: 1,
            position: 'relative',
          }}
        >
          {showNoteLabel && (
            <span
              style={{
                position: 'absolute',
                bottom: '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '12px',
                color: 'black',
              }}
            >
              {note}
            </span>
          )}
        </Button>
      ))}
      {blackKeys.map(
        (note, index) =>
          note && (
            <Button
              key={note + index}
              onClick={() => handleGuess(note)}
              style={{
                width: '30px',
                height: '60%',
                margin: '1px',
                backgroundColor: 'black',
                color: 'white',
                position: 'absolute',
                left: `${(index + 1) * 40 - 15}px`,
                zIndex: 2,
              }}
            >
              {note}
            </Button>
          ),
      )}
    </div>
  )
}

export default NoteInput
