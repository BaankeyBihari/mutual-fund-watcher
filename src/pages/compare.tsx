import * as React from "react"

import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import consola from "consola"

import MFSelectorFromAllMF from "@components/MFSelectorFromAllMF"
import NavBar from "@components/Navbar"
import ShowSelectedMF from "@components/ShowSelectedMF"
import useMF from "@hooks/useMF"
import { useStore } from "@hooks/useStore"

export default function Compare(props) {
  const { selectedSchemes, enabledSchemes, disabledSchemes } = useStore()
  const responseMF = useMF(enabledSchemes, {
    enabled: true,
  })
  const responseMFDisabled = useMF(disabledSchemes, {
    enabled: false,
  })

  React.useEffect(() => {
    consola.debug("responseMFDisabled", responseMFDisabled)
  }, [responseMFDisabled])

  return (
    <Container maxWidth="lg">
      <NavBar {...props} currentItem="compare" />
      <MFSelectorFromAllMF />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs>
          {selectedSchemes.length > 0 ? (
            responseMF.every((e) => !e.isLoading) ? (
              <ShowSelectedMF
                responseMF={responseMF}
                selectedSchemes={selectedSchemes}
              />
            ) : (
              <div>
                <CircularProgress />
              </div>
            )
          ) : null}
        </Grid>
      </Grid>
    </Container>
  )
}
