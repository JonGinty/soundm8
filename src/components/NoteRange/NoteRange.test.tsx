import { screen } from '@testing-library/react'
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
