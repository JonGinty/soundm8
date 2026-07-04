import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderMantine } from '../utils/test-utils'
import SliderWithLabel from './SliderWithLabel'

describe('SliderWithLabel', () => {
  it('derives the thumb aria-label from the wrapper label when not explicitly set', () => {
    renderMantine(
      <SliderWithLabel
        wrapper={{ label: 'Volume' }}
        value={5}
        min={0}
        max={10}
      />,
    )
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument()
  })

  it('lets an explicit thumbLabel override the derived one', () => {
    renderMantine(
      <SliderWithLabel
        wrapper={{ label: 'Volume' }}
        thumbLabel="Custom label"
        value={5}
        min={0}
        max={10}
      />,
    )
    expect(
      screen.getByRole('slider', { name: 'Custom label' }),
    ).toBeInTheDocument()
  })

  it('generates an id linking the label to the control when none is provided', () => {
    renderMantine(
      <SliderWithLabel
        wrapper={{ label: 'Volume' }}
        value={5}
        min={0}
        max={10}
      />,
    )
    expect(screen.getByText('Volume').getAttribute('for')).toBeTruthy()
  })

  it('uses an explicit id when provided', () => {
    renderMantine(
      <SliderWithLabel
        id="my-slider"
        wrapper={{ label: 'Volume' }}
        value={5}
        min={0}
        max={10}
      />,
    )
    expect(screen.getByText('Volume')).toHaveAttribute('for', 'my-slider')
  })
})
