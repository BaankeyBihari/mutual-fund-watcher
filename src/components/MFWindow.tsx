import { useState, useEffect, Fragment, useRef } from "react"
import { useCallback } from "react"

import Box from "@material-ui/core/Box/Box"
import Container from "@material-ui/core/Container/Container"
import CssBaseline from "@material-ui/core/CssBaseline"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"
import { parse, subDays, subSeconds } from "date-fns"

import MFInvestment from "@components/MFInvestment"
import MFPerformanceWindow from "@components/MFPerformanceWindow"
import MFPerformanceWindowCustom from "@components/MFPerformanceWindowCustom"
import MFSelector from "@components/MFSelector"
import ToggleSwitch from "@components/ToggleSwitch"

export default function MFWindow(props) {
  const [selectedSchemes, setSelectedSchemes] = useState([])
  const [selectedInvestmentSchemes, setSelectedInvestmentSchemes] = useState([])
  const [investments, setInvestments] = useState([])
  const [tank, setTank] = useState({})
  const [allowOutdated, setAllowOtdated] = useState(true)
  const [show10, setShow10] = useState(false)
  const [show30, setShow30] = useState(false)
  const [show60, setShow60] = useState(false)
  const [show90, setShow90] = useState(false)
  const [showCustom, setShowCustom] = useState(true)
  const [showInvestments, setShowInvestments] = useState(true)
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
    let tempSelectedSchemes = [
      ...selectedSchemes,
      ...selectedInvestmentSchemes,
    ].reduce((acc, scheme) => {
      const hasProduct = !!acc.find(
        (uniqueProduct) =>
          uniqueProduct.schemeCode === scheme.schemeCode &&
          uniqueProduct.schemeName === scheme.schemeName
      )
      if (!hasProduct) {
        return [...acc, scheme]
      }
      return acc
    }, [])
    Promise.all(
      tempSelectedSchemes
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
            tempSelectedSchemes.includes(schemeToFetch) &&
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
        value.map((data: any) => {
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
              setTankOutdatedRemove(schemeToFetch.schemeCode)
            }
            updateTankFetchedAt(schemeToFetch.schemeCode, new Date())
          }
        })
        //json response
      })
      .catch((err) => {
        console.error(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchemes, selectedInvestmentSchemes])

  return (
    <Fragment>
      <CssBaseline />
      <Container>
        <Box my={`MFWindow`}>
          <MFSelector
            selectedSchemes={selectedSchemes}
            dataChangeHandler={handleDataChange}
            investments={investments}
            setInvestments={setInvestments}
          />
          <FormGroup row>
            <FormControlLabel
              control={
                <ToggleSwitch
                  inputState={allowOutdated}
                  onInputChange={setAllowOtdated}
                />
              }
              label={allowOutdated ? "Hide Outdated" : "Show Outdated"}
            />
            <FormControlLabel
              control={
                <ToggleSwitch inputState={show10} onInputChange={setShow10} />
              }
              label={show10 ? "Hide 10 Days" : "Show 10 days"}
            />
            <FormControlLabel
              control={
                <ToggleSwitch inputState={show30} onInputChange={setShow30} />
              }
              label={show30 ? "Hide 30 Days" : "Show 30 days"}
            />
            <FormControlLabel
              control={
                <ToggleSwitch inputState={show60} onInputChange={setShow60} />
              }
              label={show60 ? "Hide 60 Days" : "Show 60 days"}
            />
            <FormControlLabel
              control={
                <ToggleSwitch inputState={show90} onInputChange={setShow90} />
              }
              label={show90 ? "Hide 90 Days" : "Show 90 days"}
            />
            <FormControlLabel
              control={
                <ToggleSwitch
                  inputState={showCustom}
                  onInputChange={setShowCustom}
                />
              }
              label={showCustom ? "Hide Custom View" : "Show Custom View"}
            />
            <FormControlLabel
              control={
                <ToggleSwitch
                  inputState={showInvestments}
                  onInputChange={setShowInvestments}
                />
              }
              label={showInvestments ? "Hide Investments" : "Show Investments"}
            />
          </FormGroup>
        </Box>
        {show10 ? (
          <Box>
            <MFPerformanceWindow
              selectedSchemes={selectedSchemes}
              tank={tank}
              schemeKey={schemeKey}
              tankOutdated={tankOutdated}
              allowOutdated={allowOutdated}
              windowSize={10}
            />
          </Box>
        ) : null}
        {show30 ? (
          <Box>
            <MFPerformanceWindow
              selectedSchemes={selectedSchemes}
              tank={tank}
              schemeKey={schemeKey}
              tankOutdated={tankOutdated}
              allowOutdated={allowOutdated}
              windowSize={30}
            />
          </Box>
        ) : null}
        {show60 ? (
          <Box>
            <MFPerformanceWindow
              selectedSchemes={selectedSchemes}
              tank={tank}
              schemeKey={schemeKey}
              tankOutdated={tankOutdated}
              allowOutdated={allowOutdated}
              windowSize={60}
            />
          </Box>
        ) : null}
        {show90 ? (
          <Box>
            <MFPerformanceWindow
              selectedSchemes={selectedSchemes}
              tank={tank}
              schemeKey={schemeKey}
              tankOutdated={tankOutdated}
              allowOutdated={allowOutdated}
              windowSize={90}
            />
          </Box>
        ) : null}
        {showCustom ? (
          <Box>
            <MFPerformanceWindowCustom
              selectedSchemes={selectedSchemes}
              tank={tank}
              schemeKey={schemeKey}
              tankOutdated={tankOutdated}
              allowOutdated={allowOutdated}
            />
          </Box>
        ) : null}
        <Box>
          <MFInvestment
            selectedInvestmentSchemes={selectedInvestmentSchemes}
            setSelectedInvestmentSchemes={setSelectedInvestmentSchemes}
            investments={investments}
            // setInvestments={setInvestments}
            tank={tank}
            schemeKey={schemeKey}
          />
        </Box>
      </Container>
    </Fragment>
  )
}
