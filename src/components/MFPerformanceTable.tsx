import React, { Fragment } from "react"
import { useEffect } from "react"
import { useState } from "react"

import Paper from "@material-ui/core/Paper"
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell)

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow)

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
})

export default function CustomizedTables({ data, do123 }) {
  const classes = useStyles()

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
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Scheme Index</StyledTableCell>
                <StyledTableCell>Scheme Name</StyledTableCell>
                {do123 ? (
                  <Fragment>
                    <StyledTableCell align="right">Gain G1</StyledTableCell>
                    <StyledTableCell align="right">Gain G2</StyledTableCell>
                    <StyledTableCell align="right">Gain G3</StyledTableCell>
                  </Fragment>
                ) : (
                  <StyledTableCell align="right">Gain</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowData.map((row, index) => (
                <StyledTableRow key={row[0].toString() + index.toString()}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row[0]}
                  </StyledTableCell>
                  {do123 ? (
                    <Fragment>
                      <StyledTableCell align="right">{row[1]}</StyledTableCell>
                      <StyledTableCell align="right">
                        {row[2]?.length && row[2].length == 2
                          ? `${row[2][0]} (${row[2][1]})`
                          : `${row[2]}`}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row[3]?.length && row[3].length == 2
                          ? `${row[3][0]} (${row[3][1]})`
                          : `${row[3]}`}
                      </StyledTableCell>
                    </Fragment>
                  ) : (
                    <StyledTableCell align="right">{row[1]}</StyledTableCell>
                  )}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Fragment>
  )
}
