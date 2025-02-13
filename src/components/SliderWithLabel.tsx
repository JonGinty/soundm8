import { InputWrapper, InputWrapperProps, Slider, SliderProps } from "@mantine/core"
import { useId } from "react"



export default function SliderWithLabel({id, wrapper, ...sliderProps}: SliderWithLabelProps) {
    
    const idObj = id ? { id } : { id: useId() };
    return (<InputWrapper {...wrapper} {...idObj}><Slider {...sliderProps} {...idObj}></Slider></InputWrapper>)
}

export type SliderWithLabelProps = SliderProps & { wrapper: InputWrapperProps }