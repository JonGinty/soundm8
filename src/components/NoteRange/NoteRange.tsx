import { RangeSlider, RangeSliderValue } from '@mantine/core'
import { Scale } from 'tonal'

const NoteRange = ({
  lowest,
  highest,
  lowChange,
  highChange,
  id,
}: NoteRangeProps) => {
  const noteSet: string[] = []
  Array(10)
    .fill(0)
    .map((v, i) => Scale.get(`C${i} chromatic`).notes)
    .forEach(s => s.forEach(n => noteSet.push(n)))

  const min = 0
  const max = noteSet.length - 1

  const lowVal = noteSet.indexOf(lowest)
  const highVal = noteSet.indexOf(highest)

  const label = `${lowest} - ${highest}`

  const doChange = ([min, max]: RangeSliderValue) => {
    if (min !== lowVal) lowChange(noteSet[min])
    if (max !== highVal) highChange(noteSet[max])
  }

  return (
    <>
      <RangeSlider
        id={id}
        step={1}
        max={max}
        min={min}
        value={[lowVal, highVal]}
        minRange={2}
        label={label}
        onChange={doChange}
      ></RangeSlider>
    </>
  )
}

export type NoteRangeProps = {
  id?: string
  lowest: string
  highest: string
  lowChange: (val: string) => void
  highChange: (val: string) => void
}

export default NoteRange
