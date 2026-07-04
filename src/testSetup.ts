import '@testing-library/jest-dom'
import { vi } from 'vitest'

const { getComputedStyle } = window
window.getComputedStyle = elt => getComputedStyle(elt)
window.HTMLElement.prototype.scrollIntoView = () => {}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver

class MockAudioContext {
  currentTime = 0
  destination = {} as AudioDestinationNode
  resume = vi.fn(() => Promise.resolve())
  createOscillator = vi.fn(() => ({
    type: 'sine',
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }))
}

window.AudioContext = MockAudioContext as unknown as typeof AudioContext
