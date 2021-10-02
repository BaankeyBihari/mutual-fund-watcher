import * as React from "react"

import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"

import NavBar from "@components/Navbar"
import SampleContent from "@components/SampleContent"

export default function Home(props) {
  // const MF_MARK_OUTDATED_IN_DAYS = props.MF_MARK_OUTDATED_IN_DAYS
  // const MF_UPDATE_EXPIRY_IN_SECONDS = props.MF_UPDATE_EXPIRY_IN_SECONDS
  const router = useRouter()
  return (
    <Container maxWidth="lg">
      <NavBar {...props} currentItem="home" />
      <Grid container>
        <Grid item xs={12}>
          <SampleContent />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            {router.query?.mfCode}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            {router.pathname}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  )
}
