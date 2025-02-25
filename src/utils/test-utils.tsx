import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'

export function renderMantine(
  ui: React.ReactNode,
  options?: Omit<RenderOptions, 'queries'> | undefined,
): RenderResult {
  return render(<MantineProvider>{ui}</MantineProvider>, options)
}
