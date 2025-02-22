import { useState } from 'react'
import nextChallenge from '../engine/nextChallenge'
import { synthesizeSequence } from '../engine/audio/synthesize'
import Notation from './Notation/Notation'

const MyComponent = () => {
  const [seq, setSeq] = useState<string[]>([])

  const next = async () => {
    const challenge = await nextChallenge({
      scale: 'C major',
      lowestNote: 'C4',
      highestNote: 'C5',
      noteCount: 10,
      maxInterval: 8,
    })

    setSeq(challenge)
    await synthesizeSequence(challenge, 400)
  }

  return (
    <div>
      <h1>MyComponent</h1>
      <button onClick={next}>next!</button>
      <div>
        {seq.map((note, i) => (
          <>
            <span key={i}>{note}</span>
            <span>, </span>
          </>
        ))}
      </div>
      <Notation sequence={seq} clef="treble" />
    </div>
  )
}

export default MyComponent
