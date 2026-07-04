import { screen, fireEvent } from '@testing-library/react'
import { renderMantine as render } from '../../utils/test-utils'
import NoteRange from './NoteRange'
import { test, expect, vi } from 'vitest'

const getRangeSliders = () => {
  const rangeSliderElements = screen.getAllByRole('slider')
  expect(rangeSliderElements).toHaveLength(2)
  rangeSliderElements.forEach(el => expect(el).toBeInTheDocument())
  return rangeSliderElements
}

test('renders NoteRange component without crashing', () => {
  render(
    <NoteRange
      lowest="C4"
      highest="G4"
      lowChange={vi.fn()}
      highChange={vi.fn()}
      id="note-range"
    />,
  )
  getRangeSliders()
})

test('renders the correct initial range', () => {
  render(
    <NoteRange
      lowest="C4"
      highest="G4"
      lowChange={vi.fn()}
      highChange={vi.fn()}
      id="note-range"
    />,
  )
  const [low, high] = getRangeSliders()
  // this is a little brittle, don't worry about changing this if we mess with range
  expect(low).toHaveAttribute('aria-valuenow', '48')
  expect(high).toHaveAttribute('aria-valuenow', '55')
})

test('moving the lowest note thumb calls lowChange with the new note, and does not call highChange', () => {
  const lowChange = vi.fn()
  const highChange = vi.fn()
  render(
    <NoteRange
      lowest="C4"
      highest="G4"
      lowChange={lowChange}
      highChange={highChange}
      id="note-range"
    />,
  )

  const [low] = getRangeSliders()
  low.focus()
  fireEvent.keyDown(low, { key: 'ArrowRight' })

  // tonal's chromatic scale spells this note as a flat, not 'C#4'
  expect(lowChange).toHaveBeenCalledWith('Db4')
  expect(highChange).not.toHaveBeenCalled()
})

test('the thumbs expose a distinct accessible name for each end of the range', () => {
  render(
    <NoteRange
      lowest="C4"
      highest="G4"
      lowChange={vi.fn()}
      highChange={vi.fn()}
      id="note-range"
    />,
  )

  expect(
    screen.getByRole('slider', { name: 'Lowest note' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('slider', { name: 'Highest note' }),
  ).toBeInTheDocument()
})
