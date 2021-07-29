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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
]

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
})

export default function CustomizedTables({ data }) {
  const classes = useStyles()

  const [rowData, setRowData] = useState([])

  useEffect(() => {
    // console.log("data", data)
    if (data && data.length) {
      let tRowData = []
      for (let i = 1; i < data[0].length; i++) {
        tRowData.push([data[0][i], data[1][i]])
      }
      tRowData.sort((a, b) => b[1] - a[1])
      setRowData(tRowData)
    } else {
      setRowData([])
    }
  }, [data])

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
                <StyledTableCell>Scheme Name</StyledTableCell>
                <StyledTableCell align="right">Gain</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowData.map((row) => (
                <StyledTableRow key={row[0]}>
                  <StyledTableCell component="th" scope="row">
                    {row[0]}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row[1]}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Fragment>
  )
}
