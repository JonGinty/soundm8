import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App routing', () => {
  it('shows the home page by default', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /Hi there!/i }),
    ).toBeInTheDocument()
  })

  it('navigates to the TextGame page via the nav link', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'TextGame' }))

    expect(await screen.findByText('Settings')).toBeInTheDocument()
  })

  it('navigates to the AudioGame placeholder via the nav link', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'AudioGame' }))

    expect(
      await screen.findByText(/this one doesn't exist yet/i),
    ).toBeInTheDocument()
  })

  it('navigates back home from another page', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: 'AudioGame' }))
    await screen.findByText(/this one doesn't exist yet/i)

    fireEvent.click(screen.getByRole('link', { name: 'Home' }))

    expect(
      await screen.findByRole('heading', { name: /Hi there!/i }),
    ).toBeInTheDocument()
  })

  it('toggles the mobile nav burger', () => {
    render(<App />)

    const burger = screen.getByRole('button', { name: /toggle navigation/i })
    expect(burger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(burger)

    expect(burger).toHaveAttribute('aria-expanded', 'true')
  })
})
