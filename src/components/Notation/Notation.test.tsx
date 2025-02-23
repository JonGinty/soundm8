import { render, screen } from '@testing-library/react'
import Notation from './Notation'
import { test, expect } from 'vitest'

const getSvg = (
  el: HTMLElement,
  errorIfMultiple: boolean = true,
): SVGSVGElement => {
  const firstSvg = el.querySelector('svg')

  expect(firstSvg).toBeInTheDocument()
  if (errorIfMultiple) {
    expect(el.querySelectorAll('svg').length).toBe(1)
  }
  expect(firstSvg).toBeInstanceOf(SVGSVGElement)
  return firstSvg as SVGSVGElement
}

const countNotes = (svg: SVGSVGElement) => {
  const notes = svg.querySelectorAll('.vf-stavenote')
  return notes.length
}

test('renders Notation component without crashing', () => {
  render(<Notation sequence={['C4', 'D4', 'E4']} clef="treble" />)
  const notationElement = screen.getByTestId('notation-container')
  expect(notationElement).toBeInTheDocument()
  getSvg(notationElement)
})

test('renders the correct clef', () => {
  render(<Notation sequence={['C4', 'D4', 'E4']} clef="bass" />)
  const notationElement = screen.getByTestId('notation-container')
  expect(notationElement).toBeInTheDocument()

  // not really found a good way to verify the clef here
  const svg = getSvg(notationElement)
  expect(countNotes(svg)).toBe(3)
})

test('renders the correct sequence', () => {
  render(<Notation sequence={['C4', 'D4', 'E4', 'A4']} clef="treble" />)
  const notationElement = screen.getByTestId('notation-container')
  expect(notationElement).toBeInTheDocument()

  const svg = getSvg(notationElement)
  expect(countNotes(svg)).toBe(4)
})

test('handles empty sequence gracefully', () => {
  render(<Notation sequence={[]} clef="treble" />)
  const notationElement = screen.getByTestId('notation-container')
  expect(notationElement).toBeInTheDocument()
  // Additional checks can be added here to verify the handling of empty sequence
})
