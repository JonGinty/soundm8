import { describe, it, expect } from 'vitest'
import { screen, fireEvent, render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import SimpleNavLink from './SimpleNavLink'

const renderAt = (path: string) =>
  render(
    <MantineProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <SimpleNavLink to="/" label="Home" />
                <SimpleNavLink to="/TextGame" label="TextGame" />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </MantineProvider>,
  )

describe('SimpleNavLink', () => {
  it('renders a link with the given label and href', () => {
    renderAt('/')
    const link = screen.getByRole('link', { name: 'Home' })
    expect(link).toHaveAttribute('href', '/')
  })

  it('marks itself active when it matches the current location', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'data-active',
      'true',
    )
    expect(screen.getByRole('link', { name: 'TextGame' })).not.toHaveAttribute(
      'data-active',
    )
  })

  it('navigates client-side when clicked, updating which link is active', () => {
    renderAt('/')
    fireEvent.click(screen.getByRole('link', { name: 'TextGame' }))

    expect(screen.getByRole('link', { name: 'TextGame' })).toHaveAttribute(
      'data-active',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Home' })).not.toHaveAttribute(
      'data-active',
    )
  })
})
