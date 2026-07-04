import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderMantine } from '../../utils/test-utils'
import NoteInput from './NoteInput'

const setViewportWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
}

beforeEach(() => {
  setViewportWidth(1024)
})

describe('NoteInput - text mode', () => {
  it('calls handleGuess with the typed value and clears the field', () => {
    const handleGuess = vi.fn()
    renderMantine(<NoteInput inputMode="text" handleGuess={handleGuess} />)

    const input = screen.getByPlaceholderText(
      'type your answer here',
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'C' } })

    expect(handleGuess).toHaveBeenCalledWith('C')
    expect(input.value).toBe('')
  })

  it('does not call handleGuess when cleared to an empty value', () => {
    const handleGuess = vi.fn()
    renderMantine(<NoteInput inputMode="text" handleGuess={handleGuess} />)

    const input = screen.getByPlaceholderText('type your answer here')
    fireEvent.change(input, { target: { value: '' } })

    expect(handleGuess).not.toHaveBeenCalled()
  })
})

describe('NoteInput - piano keyboard mode', () => {
  it('renders one octave of white keys plus the closing C, with visible letters in keyboardletters mode', () => {
    renderMantine(
      <NoteInput inputMode="keyboardletters" handleGuess={vi.fn()} />,
    )

    expect(screen.getAllByRole('button', { name: 'C' })).toHaveLength(2)
    ;['D', 'E', 'F', 'G', 'A', 'B'].forEach(note => {
      expect(screen.getAllByRole('button', { name: note })).toHaveLength(1)
    })
  })

  it('renders the black keys with visible letters in keyboardletters mode', () => {
    renderMantine(
      <NoteInput inputMode="keyboardletters" handleGuess={vi.fn()} />,
    )
    ;['C#', 'D#', 'F#', 'G#', 'A#'].forEach(note => {
      expect(screen.getByRole('button', { name: note })).toBeInTheDocument()
    })
  })

  it('renders keys with no visible label in keyboard mode', () => {
    renderMantine(<NoteInput inputMode="keyboard" handleGuess={vi.fn()} />)

    // 8 white keys (7 notes + closing C) + 5 black keys for one octave
    expect(screen.getAllByRole('button')).toHaveLength(13)
    expect(screen.queryByText('C')).not.toBeInTheDocument()
  })

  it('calls handleGuess with the natural note when a white key is clicked', () => {
    const handleGuess = vi.fn()
    renderMantine(
      <NoteInput inputMode="keyboardletters" handleGuess={handleGuess} />,
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'D' })[0])

    expect(handleGuess).toHaveBeenCalledWith('D')
  })

  it('calls handleGuess with the sharp note when a black key is clicked', () => {
    const handleGuess = vi.fn()
    renderMantine(
      <NoteInput inputMode="keyboardletters" handleGuess={handleGuess} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'C#' }))

    expect(handleGuess).toHaveBeenCalledWith('C#')
  })

  it('treats a lowercase key press as a natural note', () => {
    const handleGuess = vi.fn()
    renderMantine(
      <NoteInput inputMode="keyboardletters" handleGuess={handleGuess} />,
    )

    fireEvent.keyDown(window, { key: 'c' })

    expect(handleGuess).toHaveBeenCalledWith('C')
  })

  it('treats an uppercase (shifted) key press as a sharp note', () => {
    const handleGuess = vi.fn()
    renderMantine(
      <NoteInput inputMode="keyboardletters" handleGuess={handleGuess} />,
    )

    fireEvent.keyDown(window, { key: 'C' })

    expect(handleGuess).toHaveBeenCalledWith('C#')
  })

  it('treats "z" as an alias for B (easier to reach on a physical keyboard)', () => {
    const handleGuess = vi.fn()
    renderMantine(
      <NoteInput inputMode="keyboardletters" handleGuess={handleGuess} />,
    )

    fireEvent.keyDown(window, { key: 'z' })

    expect(handleGuess).toHaveBeenCalledWith('B')
  })

  it('ignores key presses that are not a playable note', () => {
    const handleGuess = vi.fn()
    renderMantine(
      <NoteInput inputMode="keyboardletters" handleGuess={handleGuess} />,
    )

    fireEvent.keyDown(window, { key: 'q' })

    expect(handleGuess).not.toHaveBeenCalled()
  })

  it('recalculates layout on window resize without crashing, offering more octaves on a wider viewport', () => {
    renderMantine(
      <NoteInput inputMode="keyboardletters" handleGuess={vi.fn()} />,
    )
    const initialCCount = screen.getAllByRole('button', { name: 'C' }).length

    setViewportWidth(2000)
    expect(() => fireEvent(window, new Event('resize'))).not.toThrow()

    const resizedCCount = screen.getAllByRole('button', { name: 'C' }).length
    expect(resizedCCount).toBeGreaterThan(initialCCount)
  })
})
