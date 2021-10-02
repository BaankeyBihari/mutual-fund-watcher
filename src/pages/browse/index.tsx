import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"

import NavBar from "@components/Navbar"
import SampleContent from "@components/SampleContent"

export default function Browse(props) {
  // const MF_MARK_OUTDATED_IN_DAYS = props.MF_MARK_OUTDATED_IN_DAYS
  // const MF_UPDATE_EXPIRY_IN_SECONDS = props.MF_UPDATE_EXPIRY_IN_SECONDS
  const router = useRouter()
  return (
    <Container maxWidth="lg">
      <NavBar {...props} currentItem="browse" />
      <Container>
        <SampleContent />
      </Container>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {router.query?.mfCode ? router.query.mfCode : "null"} Index
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom>
          {router.pathname}
        </Typography>
      </Box>
    </Container>
  )
}
