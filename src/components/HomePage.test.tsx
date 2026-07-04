import { describe, it, expect } from 'vitest'
import { screen, fireEvent, render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import HomePage from './HomePage'

const renderWithRouter = () =>
  render(
    <MantineProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/TextGame" element={<div>TextGame page</div>} />
        </Routes>
      </MemoryRouter>
    </MantineProvider>,
  )

describe('HomePage', () => {
  it('renders a welcome heading', () => {
    renderWithRouter()
    expect(
      screen.getByRole('heading', { name: /Hi there!/i }),
    ).toBeInTheDocument()
  })

  it('navigates to TextGame when the play button is clicked', () => {
    renderWithRouter()
    fireEvent.click(screen.getByRole('button', { name: 'Play TextGame' }))
    expect(screen.getByText('TextGame page')).toBeInTheDocument()
  })
})
