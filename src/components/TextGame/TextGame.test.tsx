import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderMantine } from '../../utils/test-utils'
import TextGame from './TextGame'
import TextGameSettings from './TextGame.settings'
import * as nextChallengeModule from '../../engine/nextChallenge'
import synthesize, { synthesizeSequence } from '../../engine/audio/synthesize'

vi.mock('../../engine/audio/synthesize', () => ({
  default: vi.fn().mockResolvedValue(undefined),
  synthesizeSequence: vi.fn().mockResolvedValue(undefined),
}))

const baseSettings: TextGameSettings = {
  mode: 'treble',
  sfx: true,
  highestNote: 'C6',
  lowestNote: 'C4',
  noteCount: 2,
  maxInterval: 12,
  scale: 'C major',
  inputMode: 'text',
}

const mockChallenge = (notes: string[]) =>
  vi.spyOn(nextChallengeModule, 'default').mockResolvedValue(notes)

const guessInput = () => screen.getByPlaceholderText('type your answer here')
const guess = (letter: string) =>
  fireEvent.change(guessInput(), { target: { value: letter } })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TextGame', () => {
  it('loads and displays the first challenge on mount', async () => {
    mockChallenge(['C4', 'D4'])
    renderMantine(<TextGame {...baseSettings} backClicked={vi.fn()} />)

    await waitFor(() => {
      const notation = screen.getByTestId('notation-container')
      expect(notation.querySelectorAll('.vf-stavenote')).toHaveLength(2)
    })
  })

  it('awards points and does not lose progress on a correct guess', async () => {
    mockChallenge(['C4', 'D4'])
    renderMantine(
      <TextGame {...baseSettings} noteCount={2} backClicked={vi.fn()} />,
    )
    await screen.findByText('Score: 0')

    guess('C')

    await screen.findByText('Score: 10')
  })

  it('deducts points on an incorrect guess but keeps prior correct progress', async () => {
    mockChallenge(['C4', 'D4'])
    renderMantine(
      <TextGame {...baseSettings} noteCount={2} backClicked={vi.fn()} />,
    )
    await screen.findByText('Score: 0')

    guess('C') // correct, score -> 10
    await screen.findByText('Score: 10')

    guess('X') // wrong second note, score -> 0
    await screen.findByText('Score: 0')

    // the earlier correct 'C' should still be displayed, not wiped out
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('plays a sound on a correct guess when sfx is enabled', async () => {
    mockChallenge(['C4', 'D4'])
    renderMantine(
      <TextGame {...baseSettings} sfx={true} backClicked={vi.fn()} />,
    )
    await screen.findByText('Score: 0')

    guess('C')

    await waitFor(() => expect(vi.mocked(synthesize)).toHaveBeenCalled())
  })

  it('plays a sound on an incorrect guess when sfx is enabled', async () => {
    mockChallenge(['C4', 'D4'])
    renderMantine(
      <TextGame {...baseSettings} sfx={true} backClicked={vi.fn()} />,
    )
    await screen.findByText('Score: 0')

    guess('X')

    await waitFor(() =>
      expect(vi.mocked(synthesizeSequence)).toHaveBeenCalled(),
    )
  })

  it('does not play any sound when sfx is disabled', async () => {
    mockChallenge(['C4', 'D4'])
    renderMantine(
      <TextGame {...baseSettings} sfx={false} backClicked={vi.fn()} />,
    )
    await screen.findByText('Score: 0')

    guess('C')
    await screen.findByText('Score: 10')
    guess('X')
    await screen.findByText('Score: 0')

    expect(vi.mocked(synthesize)).not.toHaveBeenCalled()
    expect(vi.mocked(synthesizeSequence)).not.toHaveBeenCalled()
  })

  it('loads a new challenge once the full sequence is guessed correctly', async () => {
    const spy = mockChallenge(['C4'])
    renderMantine(
      <TextGame {...baseSettings} noteCount={1} backClicked={vi.fn()} />,
    )
    await screen.findByText('Score: 0')

    guess('C')

    await screen.findByText('Score: 10')
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2))
  })

  it('deducts points and loads a new challenge on skip', async () => {
    const spy = mockChallenge(['C4', 'D4'])
    renderMantine(<TextGame {...baseSettings} backClicked={vi.fn()} />)
    await screen.findByText('Score: 0')

    fireEvent.click(screen.getByRole('button', { name: /skip/i }))

    await screen.findByText('Score: -10')
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2))
  })

  it('calls backClicked when the back button is clicked', async () => {
    mockChallenge(['C4', 'D4'])
    const backClicked = vi.fn()
    renderMantine(<TextGame {...baseSettings} backClicked={backClicked} />)
    await screen.findByText('Score: 0')

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(backClicked).toHaveBeenCalled()
  })

  it('ignores a guess that arrives while the next challenge is still loading (regression)', async () => {
    const spy = vi.spyOn(nextChallengeModule, 'default')
    spy.mockResolvedValueOnce(['C4'])
    let resolveSecond: (notes: string[]) => void = () => {}
    spy.mockImplementationOnce(
      () =>
        new Promise<string[]>(resolve => {
          resolveSecond = resolve
        }),
    )

    renderMantine(
      <TextGame {...baseSettings} noteCount={1} backClicked={vi.fn()} />,
    )
    await screen.findByText('Score: 0')

    // completes the only note, which triggers loading the next challenge
    guess('C')
    await screen.findByText('Score: 10')

    // seq is now stale (still length 1, already fully guessed) while the
    // next challenge is still in flight - this used to throw
    expect(() => guess('D')).not.toThrow()
    expect(screen.getByText('Score: 10')).toBeInTheDocument()

    resolveSecond(['E4'])
    await waitFor(() => {
      const notation = screen.getByTestId('notation-container')
      expect(notation.querySelectorAll('.vf-stavenote')).toHaveLength(1)
    })
  })
})
