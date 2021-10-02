import React from "react"

import consola from "consola"
import { addDays, compareAsc, parse, subDays } from "date-fns"
import getConfig from "next/config"

import schemeKey from "@helpers/schemeKey"

import SelectedMFGraph from "./SelectedMFGraph"
import SelectedMFTable from "./SelectedMFTable"

const ShowSelectedMF = (props) => {
  const { responseMF, selectedSchemes } = props
  const { publicRuntimeConfig } = getConfig()
  const MF_SELECTOR_MAX_PARTIONS = parseInt(
    publicRuntimeConfig.MF_SELECTOR_MAX_PARTIONS
  )
  const MF_SELECTOR_MIN_WINDOW_SIZE = parseInt(
    publicRuntimeConfig.MF_SELECTOR_MIN_WINDOW_SIZE
  )
  const MF_MARK_OUTDATED_IN_DAYS = parseInt(
    publicRuntimeConfig.MF_MARK_OUTDATED_IN_DAYS
  )
  const [windowSize, setWindowSize] = React.useState(
    MF_SELECTOR_MIN_WINDOW_SIZE
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Mutual Fund Scheme",
        columns: [
          {
            Header: "Scheme Name",
            accessor: "meta.schemeName",
          },
          {
            Header: "Scheme Code",
            accessor: "meta.schemeCode",
          },
        ],
      },
      {
        Header: "NAV",
        columns: [
          {
            Header: "Gain",
            accessor: "gain",
          },
          {
            Header: "At Start",
            accessor: "firstNAV",
          },
          {
            Header: "At End",
            accessor: "lastNAV",
          },
          {
            Header: "Period High",
            accessor: "highNAV",
          },
          {
            Header: "Period Low",
            accessor: "lowNAV",
          },
        ],
      },
    ],
    []
  )

  const [tableData, setTableData] = React.useState([])

  const [windowOffset, setWindowOffset] = React.useState(0)

  const [numPartitions, setNumPartitions] = React.useState(3)

  // eslint-disable-next-line no-unused-vars
  const updateWindowSize = (v: number) => {
    if (v >= MF_SELECTOR_MIN_WINDOW_SIZE) {
      setWindowSize(v)
      updateNumPartitions(numPartitions)
    }
  }

  // eslint-disable-next-line no-unused-vars
  const updateWindowOffset = (v: number) => {
    if (v >= 0) {
      setWindowOffset(v)
    }
  }

  const updateNumPartitions = (v: number) => {
    if (v > 0 && v <= MF_SELECTOR_MAX_PARTIONS) {
      setNumPartitions(Math.min(windowSize, v))
    }
  }

  React.useEffect(() => {
    const gainFunc = (current, base) => {
      if (base != 0) {
        return (
          Math.round(((current - base) / base) * 100 + Number.EPSILON) / 100
        )
      }
      return "Base is Zero"
    }
    const dataManipulatorHelper = (data) => {
      let firstDate
      let lastDate
      if (data.length) {
        lastDate = data[0].date
        firstDate = data[data.length - 1].date
      }
      return {
        presentOnFirst:
          data.length > 0 &&
          compareAsc(
            data[data.length - 1].date,
            addDays(firstDate, MF_MARK_OUTDATED_IN_DAYS)
          ) <= 0,
        presentOnLast:
          data.length > 0 &&
          compareAsc(
            subDays(lastDate, MF_MARK_OUTDATED_IN_DAYS),
            data[0].date
          ) <= 0,
        gain:
          data.length > 0
            ? gainFunc(data[0].nav, data[data.length - 1].nav)
            : "No Data",
        gainArr:
          data.length > 0
            ? gainFunc(data[0].nav, data[data.length - 1].nav)
            : "No Data",
        firstNAV: data.length > 0 ? data[data.length - 1].nav : "No Data",
        lastNAV: data.length > 0 ? data[0].nav : "No Data",
        lowNAV:
          data.length > 0 ? Math.min(...data.map((ee) => ee.nav)) : "No Data",
        highNAV:
          data.length > 0 ? Math.max(...data.map((ee) => ee.nav)) : "No Data",
      }
    }
    const dataManipulator = (data) => {
      const lastDate = subDays(new Date(), windowOffset)
      const firstDate = subDays(new Date(), windowOffset + windowSize)
      let partitions = []
      let dOff = windowSize / numPartitions
      for (let i = 0; i < numPartitions; i++) {
        partitions.push([Math.round(dOff * i), Math.round(dOff * (i + 1))])
      }
      partitions = partitions.map((e) => {
        return e.map((ee) => subDays(lastDate, ee))
      })
      return data
        .map((e) => {
          return {
            meta: { schemeCode: e.meta.scheme_code },
            data: e.data
              .map((ee) => {
                return {
                  ...ee,
                  date: parse(ee.date, "dd-MM-yyyy", new Date()),
                  nav: parseFloat(ee.nav),
                }
              })
              .filter(
                (ee) =>
                  compareAsc(firstDate, ee.date) < 0 &&
                  compareAsc(ee.date, lastDate) < 0
              ),
          }
        })
        .map((e) => {
          return {
            ...e,
            ...dataManipulatorHelper(e.data),
          }
        })
        .map((e) => {
          let partitionData = []
          for (const [lastDate, firstDate] of partitions) {
            partitionData.push(
              e.data.filter(
                (ee) =>
                  compareAsc(firstDate, ee.date) < 0 &&
                  compareAsc(ee.date, lastDate) < 0
              )
            )
          }
          partitionData = partitionData.map((ee) => ({
            data: ee,
            ...dataManipulatorHelper(ee),
          }))
          return { ...e, partitionData }
        })
    }

    const dataMapper = (scheme, node) => {
      return {
        ...node,
        meta: { ...node.meta, ...scheme, schemeKey: schemeKey(scheme) },
      }
    }
    let massagedData = dataManipulator(responseMF.map((e) => e.data))
    let dataStore = selectedSchemes.map((e) => {
      let node = massagedData.find(
        (mfData) => mfData.meta.schemeCode === e.schemeCode
      )
      return node
        ? dataMapper(e, node)
        : {
            meta: { ...e, schemeKey: schemeKey(e) },
            data: [],
            ...dataManipulatorHelper([]),
          }
    })
    let tableDataStore = dataStore
      .filter((e) => e.data.length > 0)
      .sort((n, p) => n.gain > p.gain)
    tableDataStore = dataStore.reduce((arr, e) => {
      if (e.data.length > 0) {
        return arr
      }
      return [...arr, e]
    }, tableDataStore)
    setTableData(tableDataStore)
    consola.debug("responseMF", responseMF)
    consola.debug("selectedSchemes", selectedSchemes)
    consola.debug("dataStore", dataStore)
  }, [
    MF_MARK_OUTDATED_IN_DAYS,
    numPartitions,
    responseMF,
    selectedSchemes,
    windowOffset,
    windowSize,
  ])
  return (
    <React.Fragment>
      <SelectedMFGraph />
      {tableData.length > 0 ? (
        <SelectedMFTable rows={tableData} columns={columns} />
      ) : null}
    </React.Fragment>
  )
}

export default ShowSelectedMF
