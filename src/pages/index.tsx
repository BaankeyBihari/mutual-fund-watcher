import { useState, useEffect } from "react"

import { parse, subDays, subHours } from "date-fns"

import MFSelector from "@components/MFSelector"

export default function Home() {
  const [selectedSchemes, setSelectedSchemes] = useState([])
  const [tank, setTank] = useState({})
  const [allowOutdated, setAllowOtdated] = useState(true)
  const [tankOutdated, setTankOutdated] = useState([])
  const [tankFetching, setTankFetching] = useState([])
  const [tankFetchedAt, setTankFetchedAt] = useState({})
  const [schemeToFetch, setSchemeToFetch] = useState(0)
  const handleDataChange = (v) => {
    // console.log("v", v)
    setSelectedSchemes(
      v.map((e) => {
        return e.schemeCode
      })
    )
  }

  useEffect(() => {
    let refreshWindow = subHours(new Date(), 1)
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
            let wt = subDays(new Date(), 4)
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
  ])

  // useEffect(() => {
  //   console.log("tank", tank)
  // }, [tank])

  // useEffect(() => {
  //   console.log("tankOutdated", tankOutdated)
  //   console.log(process.env.MF_UPDATE_EXPIRY_IN_SECONDS)
  //   console.log(process.env.MF_MARK_OUTDATED_IN_DAYS)
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
  }, [selectedSchemes])

  return (
    <MFSelector
      selectedSchemes={selectedSchemes}
      dataChangeHandler={handleDataChange}
    />
  )
}
