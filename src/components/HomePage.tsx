import { Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()
  return (
    <>
      <h1>Hi there!</h1>
      <p>
        Welcome to Soundm8! This is a collection of *super fun* games to help
        you practice reading music and playing by ear.
      </p>

      <h2>Soundm8? That's a dumb name</h2>
      <p>
        Yeah I know, I'm terrible at naming things. This is a working title.
      </p>
      <p>
        If you're wondering why "soundm8", it's a kind of sarcastic short text
        response in the part of the world I'm from, and sound is kind of related
        to music... right?..
      </p>

      <h2>You said something about fun games?</h2>
      <p>That's right! Check them out! (you can also use the navbar)</p>

      <h3>TextGame</h3>
      <p>Did I mention I'm terrible at naming things?</p>
      <p>
        Challenge yourself to recognise the note(s) shown on screen as soon as
        you can, type the letter corresponding to the correct note (octave
        doesn't matter) and get points when you're right!
      </p>
      <Button variant="filled" onClick={() => navigate('/TextGame')}>
        Play TextGame
      </Button>
    </>
  )
}

export default HomePage
