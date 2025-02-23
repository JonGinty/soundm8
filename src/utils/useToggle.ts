import { MouseEventHandler, useState } from 'react'

export default function useToggle(
  defaultState?: boolean | undefined,
): [boolean, (value?: boolean | undefined) => void] {
  const [val, setVal] = useState<boolean>(defaultState ?? false)

  return [
    val,
    (value?: boolean | undefined) => {
      if (typeof value === 'boolean') {
        if (val !== value) setVal(value)
      } else {
        setVal(prev => !prev)
      }
    },
  ]
}

export function useClickableToggle(
  defaultState?: boolean | undefined,
): [boolean, MouseEventHandler] {
  const [val, toggle] = useToggle(defaultState)
  return [val, () => toggle()]
}
