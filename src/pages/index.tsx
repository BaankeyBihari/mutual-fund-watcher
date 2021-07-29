import { useState, useEffect, Fragment } from "react"

import { parse, subDays, subSeconds } from "date-fns"

import MFSelector from "@components/MFSelector"
import MFToggleOutdated from "@components/MFToggleOutdated"

export default function Home(props) {
  const [selectedSchemes, setSelectedSchemes] = useState([])
  const [tank, setTank] = useState({})
  const [allowOutdated, setAllowOtdated] = useState(true)
  const [tankOutdated, setTankOutdated] = useState([])
  const [tankFetching, setTankFetching] = useState([])
  const [tankFetchedAt, setTankFetchedAt] = useState({})
  const [schemeToFetch, setSchemeToFetch] = useState(0)
  const MF_MARK_OUTDATED_IN_DAYS = props.MF_MARK_OUTDATED_IN_DAYS
  const MF_UPDATE_EXPIRY_IN_SECONDS = props.MF_UPDATE_EXPIRY_IN_SECONDS

  const handleDataChange = (v) => {
    setSelectedSchemes(
      v.map((e) => {
        return e.schemeCode
      })
    )
  }

  useEffect(() => {
    let refreshWindow = subSeconds(new Date(), MF_UPDATE_EXPIRY_IN_SECONDS)
    if (
      (!tank.hasOwnProperty(schemeToFetch) ||
        (tankFetchedAt.hasOwnProperty(schemeToFetch) &&
          refreshWindow > new Date(tankFetchedAt[schemeToFetch]))) &&
      !tankFetching.includes(schemeToFetch) &&
      selectedSchemes.includes(schemeToFetch) &&
      (!tankOutdated.includes(schemeToFetch) || allowOutdated)
    ) {
      setTankFetching([...tankFetching, schemeToFetch])
      fetch(`https://api.mfapi.in/mf/${schemeToFetch}`)
        .then((r) => r.json())
        .then((data) => {
          // console.log("API", data)
          if (data.status === "SUCCESS") {
            let ttank = { ...tank }
            ttank[schemeToFetch] = data
            setTank(ttank)
            let wt = subDays(new Date(), parseInt(MF_MARK_OUTDATED_IN_DAYS))
            let topDate = parse(data.data[0].date, "dd-MM-yyyy", new Date())
            // console.log("topDate", topDate)
            if (wt > topDate) {
              setTankOutdated([...tankOutdated, schemeToFetch])
            }
            let ttankFetchedAt = { ...tankFetchedAt }
            ttankFetchedAt[schemeToFetch] = new Date()
            setTankFetchedAt(ttankFetchedAt)
          }
          setTankFetching(
            tankFetching.filter((o) => {
              return o != schemeToFetch
            })
          )
        })
    }
  }, [
    schemeToFetch,
    tank,
    tankFetching,
    tankFetchedAt,
    tankOutdated,
    selectedSchemes,
    allowOutdated,
    MF_MARK_OUTDATED_IN_DAYS,
    MF_UPDATE_EXPIRY_IN_SECONDS,
  ])

  // useEffect(() => {
  //   console.log("tank", tank)
  // }, [tank])

  // useEffect(() => {
  //   console.log("tankOutdated", tankOutdated)
  //   console.log(props.MF_UPDATE_EXPIRY_IN_SECONDS)
  //   console.log(props)
  // }, [tankOutdated])

  // useEffect(() => {
  //   console.log("tankFetching", tankFetching)
  // }, [tankFetching])

  // useEffect(() => {
  //   console.log("tankFetchedAt", tankFetchedAt)
  // }, [tankFetchedAt])

  useEffect(() => {
    selectedSchemes.forEach((o) => {
      setSchemeToFetch(o)
    })
  }, [selectedSchemes, allowOutdated])

  return (
    <Fragment>
      <MFSelector
        selectedSchemes={selectedSchemes}
        dataChangeHandler={handleDataChange}
      />
      <MFToggleOutdated
        inputState={allowOutdated}
        onInputChange={setAllowOtdated}
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
