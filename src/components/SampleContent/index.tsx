import * as React from "react"

import Box from "@mui/system/Box"

export default function SampleContent() {
  return (
    <React.Fragment>
      <Box sx={{ my: 2 }}>
        {[...new Array(120)]
          .map(
            () =>
              `Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
          )
          .join("\n")}
      </Box>
    </React.Fragment>
  )
}
