import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderMantine } from '../../utils/test-utils'
import TextGameConfig from './TextGameConfig'
import TextGameSettings from './TextGame.settings'
import { synthesizeSequence } from '../../engine/audio/synthesize'

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
  inputMode: 'keyboardletters',
}

const selectOption = (comboboxName: string, optionName: string) => {
  fireEvent.click(screen.getByRole('textbox', { name: comboboxName }))
  fireEvent.click(screen.getByRole('option', { name: optionName }))
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('TextGameConfig', () => {
  it('changing the mode select calls handleChange with the new mode', () => {
    const handleChange = vi.fn()
    renderMantine(
      <TextGameConfig settings={baseSettings} handleChange={handleChange} />,
    )

    selectOption('Mode', 'bass clef')

    expect(handleChange).toHaveBeenCalledWith({ mode: 'bass' })
  })

  it('shows a gentle keyboard hint when text mode is selected', () => {
    renderMantine(
      <TextGameConfig
        settings={{ ...baseSettings, mode: 'text' }}
        handleChange={vi.fn()}
      />,
    )

    expect(
      screen.getByText(
        'Computer keyboard input is kind of cheating in text mode.',
      ),
    ).toBeInTheDocument()
  })

  it('changing the scale select calls handleChange with the new scale', () => {
    const handleChange = vi.fn()
    renderMantine(
      <TextGameConfig settings={baseSettings} handleChange={handleChange} />,
    )

    selectOption('Scale', 'A minor')

    expect(handleChange).toHaveBeenCalledWith({ scale: 'A minor' })
  })

  it('changing the input mode select calls handleChange with the new mode', () => {
    const handleChange = vi.fn()
    renderMantine(
      <TextGameConfig settings={baseSettings} handleChange={handleChange} />,
    )

    selectOption('Input mode', 'Text Box')

    expect(handleChange).toHaveBeenCalledWith({ inputMode: 'text' })
  })

  it('moving the notes-per-round slider calls handleChange with the new count', () => {
    const handleChange = vi.fn()
    renderMantine(
      <TextGameConfig settings={baseSettings} handleChange={handleChange} />,
    )

    const slider = screen.getByRole('slider', { name: /Notes per round/ })
    slider.focus()
    fireEvent.keyDown(slider, { key: 'ArrowRight' })

    expect(handleChange).toHaveBeenCalledWith({ noteCount: 3 })
  })

  it('moving the max-interval slider calls handleChange with the new interval', () => {
    const handleChange = vi.fn()
    renderMantine(
      <TextGameConfig settings={baseSettings} handleChange={handleChange} />,
    )

    const slider = screen.getByRole('slider', {
      name: /Max interval between notes/,
    })
    slider.focus()
    fireEvent.keyDown(slider, { key: 'ArrowRight' })

    expect(handleChange).toHaveBeenCalledWith({ maxInterval: 13 })
  })

  it('toggling the sfx switch calls handleChange with the flipped value merged into settings', () => {
    const handleChange = vi.fn()
    renderMantine(
      <TextGameConfig settings={baseSettings} handleChange={handleChange} />,
    )

    fireEvent.click(screen.getByRole('switch'))

    expect(handleChange).toHaveBeenCalledWith({ ...baseSettings, sfx: false })
  })

  it('clicking Test plays the demo sequence', async () => {
    renderMantine(
      <TextGameConfig settings={baseSettings} handleChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Test' }))

    await waitFor(() =>
      expect(vi.mocked(synthesizeSequence)).toHaveBeenCalledWith(
        ['C4', 'E4', 'G4', 'C5'],
        100,
      ),
    )
  })

  it('alerts the user if the test sound fails to play', async () => {
    vi.mocked(synthesizeSequence).mockRejectedValueOnce(new Error('boom'))
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    renderMantine(
      <TextGameConfig settings={baseSettings} handleChange={vi.fn()} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Test' }))

    await waitFor(() => expect(alertSpy).toHaveBeenCalled())
    expect(alertSpy.mock.calls[0][0]).toContain('Error playing sound')
  })

  it('shows no ledger-line warning when the note range fits within 2 ledger lines', () => {
    renderMantine(
      <TextGameConfig
        settings={{ ...baseSettings, highestNote: 'B4', lowestNote: 'E4' }}
        handleChange={vi.fn()}
      />,
    )

    expect(screen.queryByText(/Warning:/)).not.toBeInTheDocument()
  })

  it('warns when the highest note exceeds 2 ledger lines for the clef', () => {
    renderMantine(
      <TextGameConfig
        settings={{ ...baseSettings, highestNote: 'E6', lowestNote: 'E4' }}
        handleChange={vi.fn()}
      />,
    )

    expect(
      screen.getByText('Warning: E6 has 3 ledger lines in treble clef'),
    ).toBeInTheDocument()
  })

  it('does not show ledger-line warnings in text mode', () => {
    renderMantine(
      <TextGameConfig
        settings={{ ...baseSettings, mode: 'text', highestNote: 'E6' }}
        handleChange={vi.fn()}
      />,
    )

    expect(screen.queryByText(/Warning:/)).not.toBeInTheDocument()
  })
})
