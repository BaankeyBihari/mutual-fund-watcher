import { useState, useEffect, Fragment, useRef } from "react"
import { useCallback } from "react"

import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import { parse, subDays, subSeconds } from "date-fns"

import MFPerformanceWindow from "@components/MFPerformanceWindow"
import MFPerformanceWindowCustom from "@components/MFPerformanceWindowCustom"
import MFSelector from "@components/MFSelector"
import ToggleSwitch from "@components/ToggleSwitch"

export default function MFWindow(props) {
  const [selectedSchemes, setSelectedSchemes] = useState([])
  const [tank, setTank] = useState({})
  const [allowOutdated, setAllowOtdated] = useState(true)
  const [show10, setShow10] = useState(true)
  const [show30, setShow30] = useState(true)
  const [show60, setShow60] = useState(true)
  const [show90, setShow90] = useState(true)
  const [showCustom, setShowCustom] = useState(false)
  const [tankOutdated, setTankOutdated] = useState([])
  const [tankFetchedAt, setTankFetchedAt] = useState({})
  const MF_MARK_OUTDATED_IN_DAYS = props.MF_MARK_OUTDATED_IN_DAYS
  const MF_UPDATE_EXPIRY_IN_SECONDS = props.MF_UPDATE_EXPIRY_IN_SECONDS

  const handleDataChange = (v) => {
    setSelectedSchemes(v)
  }

  //   useEffect(() => {
  //     console.log("selectedSchemes", selectedSchemes)
  //   }, [selectedSchemes])

  //   useEffect(() => {
  //     console.log("allowOutdated", allowOutdated)
  //   }, [allowOutdated])

  const updateTankFetchedAt = useCallback(
    (code, date) => {
      let ttank = { ...tankFetchedAt }
      ttank[code] = date
      setTankFetchedAt(ttank)
    },
    [tankFetchedAt]
  )

  const setTankOutdatedRemove = useCallback(
    (code) => {
      setTankOutdated([...tankOutdated, code])
    },
    [tankOutdated]
  )

  const tankRef = useRef(tank)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateTank = (schemeCode, data) => {
    // console.log("updateTank", schemeCode, data)
    let ttank = { ...tankRef.current }
    ttank[schemeCode] = data
    tankRef.current = ttank
    setTank(ttank)
  }

  //   useEffect(() => {
  //     console.log("selectedSchemes", selectedSchemes)
  //   }, [selectedSchemes])

  // useEffect(() => {
  //   console.log("tank", tank)
  // }, [tank])

  //   useEffect(() => {
  //     console.log("tankOutdated", tankOutdated)
  //     console.log(props.MF_UPDATE_EXPIRY_IN_SECONDS)
  //     console.log(props)
  //   }, [props, tankOutdated])

  //   useEffect(() => {
  //     console.log("tankFetching", tankFetching)
  //   }, [tankFetching])

  //   useEffect(() => {
  //     console.log("tankFetchedAt", tankFetchedAt)
  //   }, [tankFetchedAt])

  const schemeKey = (scheme) => {
    return `${scheme.schemeCode}:${scheme.schemeName}`
  }

  useEffect(() => {
    function checkStatus(response) {
      if (response.ok) {
        return Promise.resolve(response)
      } else {
        return Promise.reject(new Error(response.statusText))
      }
    }
    function parseJSON(response) {
      return response.json()
    }
    Promise.all(
      selectedSchemes
        .filter((schemeToFetch) => {
          let refreshWindow = subSeconds(
            new Date(),
            MF_UPDATE_EXPIRY_IN_SECONDS
          )
          return (
            (!tank.hasOwnProperty(schemeToFetch.schemeCode) ||
              (tankFetchedAt.hasOwnProperty(schemeToFetch.schemeCode) &&
                refreshWindow >
                  new Date(tankFetchedAt[schemeToFetch.schemeCode]))) &&
            selectedSchemes.includes(schemeToFetch) &&
            (!tankOutdated.includes(schemeToFetch.schemeCode) || allowOutdated)
          )
        })
        .map((schemeToFetch) => {
          //   console.log("schemeToFetch", schemeToFetch)
          return fetch(`https://api.mfapi.in/mf/${schemeToFetch.schemeCode}`)
            .then(checkStatus) // check the response of our APIs
            .then(parseJSON) // parse it to Json
            .catch((error) => console.error("There was a problem!", error))
        })
    )
      .then((value) => {
        // console.log("value", value)
        value.map((data) => {
          if (data.status === "SUCCESS") {
            let schemeToFetch = {
              schemeCode: data.meta.scheme_code,
              schemeName: data.meta.scheme_name,
            }
            updateTank(data.meta.scheme_code, data)
            let wt = subDays(new Date(), parseInt(MF_MARK_OUTDATED_IN_DAYS))
            let topDate = parse(data.data[0].date, "dd-MM-yyyy", new Date())
            // console.log("topDate", topDate)
            if (wt > topDate) {
              setTankOutdatedRemove(schemeKey(schemeToFetch))
            }
            updateTankFetchedAt(schemeKey(schemeToFetch), new Date())
          }
        })
        //json response
      })
      .catch((err) => {
        console.error(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchemes])

  return (
    <Fragment>
      <MFSelector
        selectedSchemes={selectedSchemes}
        dataChangeHandler={handleDataChange}
      />
      <FormGroup row>
        <FormControlLabel
          control={
            <ToggleSwitch
              inputState={allowOutdated}
              onInputChange={setAllowOtdated}
            />
          }
          label="Toggle Outdated"
        />
        <FormControlLabel
          control={
            <ToggleSwitch inputState={show10} onInputChange={setShow10} />
          }
          label="Toggle 10"
        />
        {show10 ? (
          <MFPerformanceWindow
            selectedSchemes={selectedSchemes}
            tank={tank}
            schemeKey={schemeKey}
            tankOutdated={tankOutdated}
            allowOutdated={allowOutdated}
            windowSize={10}
          />
        ) : null}
        <FormControlLabel
          control={
            <ToggleSwitch inputState={show30} onInputChange={setShow30} />
          }
          label="Toggle 30"
        />
        {show30 ? (
          <MFPerformanceWindow
            selectedSchemes={selectedSchemes}
            tank={tank}
            schemeKey={schemeKey}
            tankOutdated={tankOutdated}
            allowOutdated={allowOutdated}
            windowSize={30}
            offset={30}
          />
        ) : null}
        <FormControlLabel
          control={
            <ToggleSwitch inputState={show60} onInputChange={setShow60} />
          }
          label="Toggle 60"
        />
        {show60 ? (
          <MFPerformanceWindow
            selectedSchemes={selectedSchemes}
            tank={tank}
            schemeKey={schemeKey}
            tankOutdated={tankOutdated}
            allowOutdated={allowOutdated}
            windowSize={60}
            offset={120}
          />
        ) : null}
        <FormControlLabel
          control={
            <ToggleSwitch inputState={show90} onInputChange={setShow90} />
          }
          label="Toggle 90"
        />
        {show90 ? (
          <MFPerformanceWindow
            selectedSchemes={selectedSchemes}
            tank={tank}
            schemeKey={schemeKey}
            tankOutdated={tankOutdated}
            allowOutdated={allowOutdated}
            windowSize={90}
            offset={300}
          />
        ) : null}
        <FormControlLabel
          control={
            <ToggleSwitch
              inputState={showCustom}
              onInputChange={setShowCustom}
            />
          }
          label="Toggle Custom"
        />
        {showCustom ? (
          <MFPerformanceWindowCustom
            selectedSchemes={selectedSchemes}
            tank={tank}
            schemeKey={schemeKey}
            tankOutdated={tankOutdated}
            allowOutdated={allowOutdated}
          />
        ) : null}
      </FormGroup>
    </Fragment>
  )
}
