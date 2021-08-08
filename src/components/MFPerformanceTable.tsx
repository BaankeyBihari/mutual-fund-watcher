import React, { Fragment } from "react"
import { useEffect } from "react"
import { useState } from "react"

import CTable from "@components/CTable"

export default function CustomizedTables({ data, do123 }) {
  const [rowData, setRowData] = useState([])

  useEffect(() => {
    // console.log("data", data)
    if (data && data.length) {
      let tdata = data.slice()
      if (do123) {
        for (let i = 3; i >= 2; i--) {
          tdata.sort((a, b) => {
            if (b[i] && a[i]) {
              return b[i] - a[i]
            } else if (b[i] && !a[i]) {
              return 1
            } else if (!b[i] && a[i]) {
              return -1
            }
            return 0
          })
          let f = (k, ind) => {
            let r = [...k]
            r[i] = [r[i], ind + 1]
            return r
          }
          tdata = tdata.map((e, index) => f(e, index))
        }
      }
      tdata.sort((a, b) => b[1] - a[1])
      setRowData(tdata)
    } else {
      setRowData([])
    }
  }, [data, do123])

  // useEffect(() => {
  //   console.log("rowData", rowData)
  // }, [rowData])

  return (
    <Fragment>
      {rowData.length ? (
        <Fragment>
          {do123 ? (
            <Fragment>
              <CTable
                headers={["Scheme Name", "Gain 1", "Gain 2", "Gain 3"]}
                data={rowData.map((el) => {
                  let t = [...el]
                  if (Array.isArray(t[t.length - 1])) {
                    t[t.length - 1] = `${t[t.length - 1][0]} (${
                      t[t.length - 1][1]
                    })`
                  }
                  if (Array.isArray(t[t.length - 2])) {
                    t[t.length - 2] = `${t[t.length - 2][0]} (${
                      t[t.length - 2][1]
                    })`
                  }
                  return t
                })}
              />
            </Fragment>
          ) : (
            <Fragment>
              <CTable
                headers={["Scheme Name", "Gain"]}
                data={rowData.map((el) => el.slice(0, 2))}
              />
            </Fragment>
          )}
        </Fragment>
      ) : null}
    </Fragment>
  )
}
