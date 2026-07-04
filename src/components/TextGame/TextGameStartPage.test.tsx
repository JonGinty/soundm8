import { describe, it, expect } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderMantine } from '../../utils/test-utils'
import TextGameStartPage from './TextGameStartPage'

describe('TextGameStartPage', () => {
  it('shows the settings form by default', () => {
    renderMantine(<TextGameStartPage />)

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start!' })).toBeInTheDocument()
  })

  it('switches to the game screen when Start! is clicked', async () => {
    renderMantine(<TextGameStartPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Start!' }))

    expect(
      await screen.findByRole('button', { name: 'Back' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })

  it('returns to the settings form when Back is clicked from the game screen', async () => {
    renderMantine(<TextGameStartPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Start!' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Back' }))

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start!' })).toBeInTheDocument()
  })
})
