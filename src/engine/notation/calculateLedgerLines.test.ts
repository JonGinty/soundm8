import { expect, test } from 'vitest'
import calculateLedgerLines from './calculateLedgerLines'

test('Calculate treble clef ledger lines', () => {
  // higher
  expect(calculateLedgerLines('C6', 'treble')).toEqual(2)
  expect(calculateLedgerLines('D6', 'treble')).toEqual(2)
  expect(calculateLedgerLines('E6', 'treble')).toEqual(3)
  expect(calculateLedgerLines('F6', 'treble')).toEqual(3)
  expect(calculateLedgerLines('G6', 'treble')).toEqual(4)
  expect(calculateLedgerLines('A6', 'treble')).toEqual(4)
  expect(calculateLedgerLines('B6', 'treble')).toEqual(5)

  // lower
  expect(calculateLedgerLines('C4', 'treble')).toEqual(1)
  expect(calculateLedgerLines('B3', 'treble')).toEqual(1)
  expect(calculateLedgerLines('A3', 'treble')).toEqual(2)
  expect(calculateLedgerLines('G3', 'treble')).toEqual(2)
  expect(calculateLedgerLines('F3', 'treble')).toEqual(3)
  expect(calculateLedgerLines('E3', 'treble')).toEqual(3)
  expect(calculateLedgerLines('D3', 'treble')).toEqual(4)

  // in range
  expect(calculateLedgerLines('E4', 'treble')).toEqual(0)
  expect(calculateLedgerLines('B4', 'treble')).toEqual(0)
  expect(calculateLedgerLines('D5', 'treble')).toEqual(0)
})

test('Calculate bass clef ledger lines', () => {
  // higher
  expect(calculateLedgerLines('C4', 'bass')).toEqual(1)
  expect(calculateLedgerLines('D4', 'bass')).toEqual(1)
  expect(calculateLedgerLines('E4', 'bass')).toEqual(2)
  expect(calculateLedgerLines('F4', 'bass')).toEqual(2)
  expect(calculateLedgerLines('G4', 'bass')).toEqual(3)
  expect(calculateLedgerLines('A4', 'bass')).toEqual(3)
  expect(calculateLedgerLines('B4', 'bass')).toEqual(4)

  // lower
  expect(calculateLedgerLines('E2', 'bass')).toEqual(1)
  expect(calculateLedgerLines('D2', 'bass')).toEqual(1)
  expect(calculateLedgerLines('C2', 'bass')).toEqual(2)
  expect(calculateLedgerLines('B1', 'bass')).toEqual(2)
  expect(calculateLedgerLines('A1', 'bass')).toEqual(3)
  expect(calculateLedgerLines('G1', 'bass')).toEqual(3)
  expect(calculateLedgerLines('F1', 'bass')).toEqual(4)
  expect(calculateLedgerLines('E1', 'bass')).toEqual(4)
  expect(calculateLedgerLines('D1', 'bass')).toEqual(5)

  // in range
  expect(calculateLedgerLines('F2', 'bass')).toEqual(0)
  expect(calculateLedgerLines('B2', 'bass')).toEqual(0)
  expect(calculateLedgerLines('D3', 'bass')).toEqual(0)
})
