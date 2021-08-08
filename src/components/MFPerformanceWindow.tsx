import { useState, useMemo, Fragment } from "react"

import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormGroup from "@material-ui/core/FormGroup"

import MFPerformanceChart from "@components/MFPerformanceChart"
import MFPerformanceTable from "@components/MFPerformanceTable"
import ToggleSwitch from "@components/ToggleSwitch"

export default function MFPerformanceWindow(props) {
  const allowOutdated = props.allowOutdated ? props.allowOutdated : false
  const tankOutdated = props.tankOutdated
  const tank = props.tank
  const selectedSchemes = props.selectedSchemes
  const offset = props?.offset ? props.offset : 0
  const windowSize = props.windowSize
  const schemeKey = props.schemeKey
  const [gainDataFrame, setGainDataFrame] = useState([])
  const [navDataFrame, setNAVDataFrame] = useState([])
  const [tableData, setTableData] = useState([])
  const [do123, setDo123] = useState(false)
  const [showGainGraph, setShowGainGraph] = useState(false)
  const [showNAVGraph, setShowNAVGraph] = useState(false)

  // useEffect(() => {
  //   setDo123(windowSize <= 730)
  // }, [windowSize])

  useMemo(() => {
    let tgDataFrame = {}
    let tnDataFrame = {}
    let nodes = ["x"]
    let ttableData = []
    selectedSchemes.forEach((element) => {
      if (
        (!tankOutdated.includes(element.schemeCode) || allowOutdated) &&
        tank.hasOwnProperty(element.schemeCode) &&
        tank[element.schemeCode].data.length > offset
      ) {
        let records = tank[element.schemeCode].data.slice(
          offset,
          windowSize + offset
        )
        let baseline = 1.0 / parseFloat(records[records.length - 1].nav)
        records = records.map((ele, index) => {
          return {
            day: index,
            gain:
              Math.round((baseline * parseFloat(ele.nav) - 1.0) * 10000) / 100,
          }
        })
        // console.log(element, records)
        nodes.push(tank[element.schemeCode].meta.scheme_name)
        tgDataFrame[tank[element.schemeCode].meta.scheme_name] = records
        records = tank[element.schemeCode].data.slice(
          offset,
          windowSize + offset
        )
        records = records.map((ele, index) => {
          return {
            day: index,
            nav: parseFloat(ele.nav),
          }
        })
        tnDataFrame[tank[element.schemeCode].meta.scheme_name] = records
      }
    })
    let nDataFrame = []
    nDataFrame.push(nodes)
    for (let i = 0; i < windowSize; i++) {
      let row = [windowSize - i]
      for (let j = 1; j < nodes.length; j++) {
        if (i < tnDataFrame[nodes[j]].length) {
          row.push(tnDataFrame[nodes[j]][i].nav)
        } else {
          row.push(null)
        }
      }
      nDataFrame.push(row)
    }
    let gDataFrame = []
    gDataFrame.push(nodes)
    for (let i = 0; i < windowSize; i++) {
      let row = [windowSize - i]
      for (let j = 1; j < nodes.length; j++) {
        if (i < tgDataFrame[nodes[j]].length) {
          row.push(tgDataFrame[nodes[j]][i].gain)
        } else {
          row.push(null)
        }
      }
      gDataFrame.push(row)
    }
    // ttableData.push(nodes.slice(1))
    // ttableData.push(gDataFrame[1].slice(1))
    // console.log("selectedSchemes", selectedSchemes)
    selectedSchemes.forEach((element) => {
      if (
        (!tankOutdated.includes(element.schemeCode) || allowOutdated) &&
        tank.hasOwnProperty(element.schemeCode)
      ) {
        let record = [schemeKey(element)]
        let window1 = offset + windowSize
        let window2 = offset + 2 * windowSize
        let window3 = offset + 3 * windowSize
        let windowR = window1
        let windowL = offset
        if (windowR < tank[element.schemeCode].data.length) {
          record.push(
            Math.round(
              ((1.0 / parseFloat(tank[element.schemeCode].data[windowR].nav)) *
                parseFloat(tank[element.schemeCode].data[windowL].nav) -
                1.0) *
                10000
            ) / 100
          )
        } else {
          record.push(null)
        }
        windowR = window2
        windowL = window1
        if (windowR < tank[element.schemeCode].data.length && do123) {
          record.push(
            Math.round(
              ((1.0 / parseFloat(tank[element.schemeCode].data[windowR].nav)) *
                parseFloat(tank[element.schemeCode].data[windowL].nav) -
                1.0) *
                10000
            ) / 100
          )
        } else {
          record.push(null)
        }
        windowR = window3
        windowL = window2
        if (windowR < tank[element.schemeCode].data.length) {
          record.push(
            Math.round(
              ((1.0 / parseFloat(tank[element.schemeCode].data[windowR].nav)) *
                parseFloat(tank[element.schemeCode].data[windowL].nav) -
                1.0) *
                10000
            ) / 100
          )
        } else {
          record.push(null)
        }
        ttableData.push(record)
      }
    })
    if (nodes.length > 1) {
      setGainDataFrame(gDataFrame)
      setNAVDataFrame(nDataFrame)
      setTableData(ttableData)
    } else {
      setGainDataFrame([])
      setNAVDataFrame([])
      setTableData([])
    }
  }, [
    selectedSchemes,
    tankOutdated,
    allowOutdated,
    tank,
    offset,
    windowSize,
    schemeKey,
    do123,
  ])

  // useEffect(() => {
  //   console.log("gainDataFrame", gainDataFrame)
  // }, [gainDataFrame])

  // useEffect(() => {
  //   console.log("tank", tank, selectedSchemes)
  // }, [tank, selectedSchemes])

  // useEffect(() => {
  //   console.log("navDataFrame", navDataFrame)
  // }, [navDataFrame])

  return (
    <Fragment>
      {selectedSchemes.length ? (
        <Fragment>
          <FormGroup row>
            <Fragment>
              <FormControlLabel
                control={
                  <ToggleSwitch
                    inputState={showGainGraph}
                    onInputChange={setShowGainGraph}
                  />
                }
                label={showGainGraph ? "Hide Gain Graph" : "Show Gain Graph"}
              />
              {showGainGraph ? (
                <MFPerformanceChart
                  data={gainDataFrame}
                  xTitle={"Days"}
                  yTitle={"Gain"}
                  chartType={"LineChart"}
                />
              ) : null}
            </Fragment>
            <Fragment>
              <FormControlLabel
                control={
                  <ToggleSwitch
                    inputState={showNAVGraph}
                    onInputChange={setShowNAVGraph}
                  />
                }
                label={showNAVGraph ? "Hide NAV Graph" : "Show NAV Graph"}
              />
              {showNAVGraph ? (
                <MFPerformanceChart
                  data={navDataFrame}
                  xTitle={"Days"}
                  yTitle={"NAV"}
                  chartType={"LineChart"}
                />
              ) : null}
            </Fragment>
            <Fragment>
              <FormControlLabel
                control={
                  <ToggleSwitch inputState={do123} onInputChange={setDo123} />
                }
                label={do123 ? "Show Single" : "Show do123"}
              />
              <MFPerformanceTable data={tableData} do123={do123} />
            </Fragment>
          </FormGroup>
        </Fragment>
      ) : null}
    </Fragment>
  )
}
