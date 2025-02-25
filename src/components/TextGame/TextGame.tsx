import { useState } from 'react'
import nextChallenge from '../../engine/nextChallenge'
import Notation from '../Notation/Notation'
import { Button, Stack, ActionIcon } from '@mantine/core'
import synthesize, { synthesizeSequence } from '../../engine/audio/synthesize'
import TextGameSettings from './TextGame.settings'
import { IconArrowLeft } from '@tabler/icons-react'
import NoteInput from './NoteInput'

const TextGame = ({
  mode,
  highestNote,
  lowestNote,
  noteCount,
  maxInterval,
  sfx,
  backClicked,
  inputMode,
}: TextGameSettings & Back) => {
  const [seq, setSeq] = useState<string[]>([])
  const [correct, setCorrect] = useState<string>('')
  const [incorrect, setIncorrect] = useState<string>('')
  const [score, setScore] = useState<number>(0)

  const soundOn = sfx

  const next = async () => {
    const challenge = await nextChallenge({
      scale: 'C major',
      highestNote,
      lowestNote,
      noteCount,
      maxInterval,
    })

    setCorrect('')
    setIncorrect('')
    setSeq(challenge)
  }

  const isSameNote = (userInput: string, tonalNote: string) => {
    return userInput.toUpperCase() === tonalNote[0]
  }

  const handleGuess = (input: string) => {
    if (isSameNote(input, seq[correct.length])) {
      setCorrect(correct + input)
      setIncorrect('')
      setScore(prev => prev + 10)
      if (soundOn) synthesize(seq[correct.length], 200)
      if (correct.length >= seq.length - 1) {
        next()
      }
    } else {
      setScore(score - 10)
      setIncorrect(input)
      if (soundOn) synthesizeSequence(['G4', 'C3', 'G3', 'C2'], 100)
    }
  }

  if (!seq?.length) {
    next()
  }

  const skip = () => {
    setScore(prev => prev - 10)
    next()
  }

  return (
    <>
      <ActionIcon variant="subtle" onClick={() => backClicked()}>
        <IconArrowLeft></IconArrowLeft>
      </ActionIcon>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Stack style={{ maxWidth: '200px' }}>
          <Stack style={{ flexGrow: 1 }}>
            <p>Score: {score}</p>
            <Notation sequence={seq} clef={mode} />
            <p>
              <span style={{ color: '#11cc88' }}>{correct}</span>
              <span style={{ color: 'red' }}>{incorrect}</span>
              {/* just allocating the space here so it doesn't grow */}
              <span style={{ visibility: 'hidden' }}>|</span>
            </p>
          </Stack>
          <Stack>
            <NoteInput handleGuess={handleGuess} inputMode={inputMode} />
            <Button fullWidth variant="outline" onClick={skip}>
              skip (-10)
            </Button>
          </Stack>
        </Stack>
      </div>
    </>
  )
}

type Back = {
  backClicked: () => void
}

export default TextGame
