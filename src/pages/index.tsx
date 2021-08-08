import { Fragment } from "react"

import MFWindow from "@components/MFWindow"
import NavBar from "@components/NavBar"

export default function Home(props) {
  const MF_MARK_OUTDATED_IN_DAYS = props.MF_MARK_OUTDATED_IN_DAYS
  const MF_UPDATE_EXPIRY_IN_SECONDS = props.MF_UPDATE_EXPIRY_IN_SECONDS
  return (
    <Fragment>
      <NavBar {...props} />
      <MFWindow
        MF_MARK_OUTDATED_IN_DAYS={MF_MARK_OUTDATED_IN_DAYS}
        MF_UPDATE_EXPIRY_IN_SECONDS={MF_UPDATE_EXPIRY_IN_SECONDS}
      />
    </Fragment>
  )
}

export async function getStaticProps() {
  return {
    props: {
      MF_UPDATE_EXPIRY_IN_SECONDS: process.env.MF_UPDATE_EXPIRY_IN_SECONDS,
      MF_MARK_OUTDATED_IN_DAYS: process.env.MF_MARK_OUTDATED_IN_DAYS,
    },
  }
}
