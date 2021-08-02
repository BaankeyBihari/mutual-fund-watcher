import React, { Fragment, useState } from "react"

import { Input } from "@material-ui/core"

import MFPerformanceWindow from "@components/MFPerformanceWindow"

export default function MFPerformanceWindowCustom(props) {
  const [windowSize, setWindowSize] = useState(10)
  const [windowStepSize, setWindowStepSize] = useState(2)
  return (
    <Fragment>
      <Input
        value={windowSize}
        onChange={(e) => {
          let n = parseInt(e.target.value)
          setWindowSize(n > 5 ? n : 5)
        }}
        type={"number"}
        inputProps={{
          "aria-label": "description",
          min: 5,
          step: windowStepSize,
        }}
      />
      <Input
        value={windowStepSize}
        onChange={(e) => {
          let n = parseInt(e.target.value)
          setWindowStepSize(n >= 1 ? n : 1)
        }}
        type={"number"}
        inputProps={{ "aria-label": "description", min: 1 }}
      />
      <MFPerformanceWindow {...props} windowSize={windowSize} />
    </Fragment>
  )
}
