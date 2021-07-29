import { useState, useMemo, Fragment } from "react"

import MFPerformanceChart from "@components/MFPerformanceChart"
import MFPerformanceTable from "@components/MFPerformanceTable"

export default function MFPerformanceWindow(props) {
  const allowOutdated = props.allowOutdated ? props.allowOutdated : false
  const tankOutdated = props.tankOutdated
  const tank = props.tank
  const selectedSchemes = props.selectedSchemes
  const windowSize = props.windowSize
  const [gainDataFrame, setGainDataFrame] = useState([])
  const [navDataFrame, setNAVDataFrame] = useState([])

  useMemo(() => {
    let tgDataFrame = {}
    let tnDataFrame = {}
    let nodes = ["x"]
    selectedSchemes.forEach((element) => {
      if (
        (!tankOutdated.includes(element) || allowOutdated) &&
        tank.hasOwnProperty(element)
      ) {
        let records = tank[element].data.slice(0, windowSize)
        let baseline = 1.0 / parseFloat(records[records.length - 1].nav)
        records = records.map((ele, index) => {
          return {
            day: index,
            gain:
              Math.round((baseline * parseFloat(ele.nav) - 1.0) * 10000) / 100,
          }
        })
        // console.log(element, records)
        nodes.push(tank[element].meta.scheme_name)
        tgDataFrame[tank[element].meta.scheme_name] = records
        records = tank[element].data.slice(0, windowSize)
        records = records.map((ele, index) => {
          return {
            day: index,
            nav: parseFloat(ele.nav),
          }
        })
        tnDataFrame[tank[element].meta.scheme_name] = records
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
    if (nodes.length > 1) {
      setGainDataFrame(gDataFrame)
      setNAVDataFrame(nDataFrame)
    } else {
      setGainDataFrame([])
      setNAVDataFrame([])
    }
  }, [allowOutdated, selectedSchemes, tank, tankOutdated, windowSize])

  // useEffect(() => {
  //   console.log("gainDataFrame", gainDataFrame)
  // }, [gainDataFrame])

  // useEffect(() => {
  //   console.log("navDataFrame", navDataFrame)
  // }, [navDataFrame])

  return (
    <Fragment>
      <MFPerformanceChart
        data={gainDataFrame}
        xTitle={"Days"}
        yTitle={"Gain"}
      />
      <MFPerformanceChart data={navDataFrame} xTitle={"Days"} yTitle={"NAV"} />
      <MFPerformanceTable data={gainDataFrame} />
    </Fragment>
  )
}
