import { Fragment } from "react"

import Box from "@material-ui/core/Box/Box"
import Button from "@material-ui/core/Button/Button"
import Input from "@material-ui/core/Input/Input"

interface CounterInputs {
  initialValue: number
  minimumValue: number
  maximumValue: number
  stepSize: number
  // eslint-disable-next-line no-unused-vars
  setValue: (n: number) => void
}

export default function Counter({
  initialValue,
  minimumValue,
  maximumValue,
  stepSize,
  setValue,
}: CounterInputs) {
  const increment = () => {
    if (maximumValue) {
      if (initialValue < maximumValue) {
        let newValue = Math.min(initialValue + stepSize, maximumValue)
        setValue(newValue)
      }
    } else {
      setValue(initialValue + stepSize)
    }
  }
  const decrement = () => {
    if (minimumValue) {
      if (initialValue > minimumValue) {
        let newValue = Math.max(initialValue - stepSize, minimumValue)
        setValue(newValue)
      }
    } else {
      setValue(initialValue - stepSize)
    }
  }
  const change = (e) => {
    let newValue = parseInt(e.target.value)
    if (maximumValue && initialValue < maximumValue) {
      newValue = Math.min(newValue, maximumValue)
    }
    if (minimumValue && initialValue > minimumValue) {
      newValue = Math.max(newValue, minimumValue)
    }
    setValue(newValue)
  }
  return (
    <Fragment>
      <Button onClick={increment}>+</Button>
      <Box width={70}>
        <Input
          disableUnderline={true}
          disabled={true}
          value={initialValue}
          onChange={change}
          type={"number"}
          fullWidth
          inputProps={{
            "aria-label": "description",
          }}
        />
      </Box>
      <Button onClick={decrement}>-</Button>
    </Fragment>
  )
}
