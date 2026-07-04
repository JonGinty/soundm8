import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import HeaderLogo from './HeaderLogo'

describe('HeaderLogo', () => {
  it('renders its icons without crashing', () => {
    const { container } = render(<HeaderLogo />)
    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0)
  })
})
