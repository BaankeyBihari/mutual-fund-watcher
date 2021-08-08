import React, { Fragment, useState } from "react"

import Box from "@material-ui/core/Box/Box"
import Container from "@material-ui/core/Container/Container"

import Counter from "@components/Counter"
import MFPerformanceWindow from "@components/MFPerformanceWindow"

export default function MFPerformanceWindowCustom(props) {
  const [windowSize, setWindowSize] = useState(10)
  const [windowStepSize, setWindowStepSize] = useState(2)
  const [offset, setOffset] = useState(0)
  return (
    <Fragment>
      {props.selectedSchemes.length ? (
        <Container>
          <Box my={`MFWindowCustom`}>
            <Fragment>
              <Counter
                initialValue={windowSize}
                minimumValue={5}
                maximumValue={700}
                stepSize={windowStepSize}
                setValue={setWindowSize}
              />
              <Counter
                initialValue={windowStepSize}
                minimumValue={1}
                maximumValue={365}
                stepSize={1}
                setValue={setWindowStepSize}
              />
              <Counter
                initialValue={offset}
                minimumValue={0}
                maximumValue={365 * 10}
                stepSize={1}
                setValue={setOffset}
              />
            </Fragment>
          </Box>
          <Box>
            <Fragment>
              <MFPerformanceWindow
                {...props}
                windowSize={windowSize}
                offset={offset}
              />
            </Fragment>
          </Box>
        </Container>
      ) : null}
    </Fragment>
  )
}
