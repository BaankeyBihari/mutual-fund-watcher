import React, { Fragment } from "react"

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

export default function CTable({ data, headers }) {
  const classes = useStyles()

  return (
    <Fragment>
      {data.length ? (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Index</StyledTableCell>
                <StyledTableCell>{headers[0]}</StyledTableCell>
                {headers.slice(1).map((el, index) => {
                  return (
                    <StyledTableCell key={`${index}-${el}`} align="right">
                      {el}
                    </StyledTableCell>
                  )
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <StyledTableRow key={row[0].toString() + index.toString()}>
                  <StyledTableCell component="th" scope="row">
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row[0]}
                  </StyledTableCell>
                  {row.slice(1).map((el, index) => {
                    return (
                      <StyledTableCell key={`${index}-${el}`} align="right">
                        {el}
                      </StyledTableCell>
                    )
                  })}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Fragment>
  )
}
