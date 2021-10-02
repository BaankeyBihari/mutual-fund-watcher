import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"

import PortfolioMF from "@components/MFPortfolio"
import NavBar from "@components/Navbar"

export default function Portfolio(props) {
  // const MF_MARK_OUTDATED_IN_DAYS = props.MF_MARK_OUTDATED_IN_DAYS
  // const MF_UPDATE_EXPIRY_IN_SECONDS = props.MF_UPDATE_EXPIRY_IN_SECONDS
  const router = useRouter()
  return (
    <Grid container maxWidth="lg">
      <NavBar {...props} currentItem="portfolio" />
      <Grid container>
        <PortfolioMF />
      </Grid>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {router.query?.mfCode}
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          {router.pathname}
        </Typography>
      </Box>
    </Grid>
  )
}
