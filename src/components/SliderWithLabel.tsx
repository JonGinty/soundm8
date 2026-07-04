import {
  InputWrapper,
  InputWrapperProps,
  Slider,
  SliderProps,
} from '@mantine/core'
import { useId } from 'react'

export default function SliderWithLabel({
  id,
  wrapper,
  ...sliderProps
}: SliderWithLabelProps) {
  const reactId = useId()
  const idObj = id ? { id } : { id: reactId }
  const thumbLabel =
    sliderProps.thumbLabel ??
    (typeof wrapper.label === 'string' ? wrapper.label : undefined)
  return (
    <InputWrapper {...wrapper} {...idObj}>
      <Slider thumbLabel={thumbLabel} {...sliderProps} {...idObj}></Slider>
    </InputWrapper>
  )
}

export type SliderWithLabelProps = SliderProps & { wrapper: InputWrapperProps }
