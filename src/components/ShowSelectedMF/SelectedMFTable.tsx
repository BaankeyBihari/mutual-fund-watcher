import React from "react"

import ArrowRightIcon from "@mui/icons-material/ArrowRight"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { styled, useTheme } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
import Box from "@mui/system/Box"
import consola from "consola"
import { useTable } from "react-table"

const SelectedMFTable = (props) => {
  const { rows, columns } = props
  const data = rows

  return (
    <Box sx={{ my: 2 }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          <MuTable columns={columns} data={data} />
        </Grid>
      </Grid>
    </Box>
  )
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))

const MuTable = ({ columns, data }) => {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })
  const theme = useTheme()
  const unFold = useMediaQuery(theme.breakpoints.up("md"))
  const translateRow = (row) => {
    let rowArr = []
    row.cells.forEach((c) => {
      let arr = []
      let t = c.column
      while (t) {
        arr.push(t.Header)
        t = t.parent
      }
      rowArr.push([...arr.reverse(), c.value])
    })
    consola.debug("rowArr", rowArr, row)
    return rowArr
  }
  // Render the UI for your table
  return (
    <TableContainer component={Paper}>
      <Table {...getTableProps()}>
        {unFold ? (
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map((column, ii) => {
                  let opacity = 1 / Math.pow(2, i)
                  let isCenter = i !== headerGroups.length - 1
                  if (ii) {
                    return (
                      <StyledTableCell
                        {...column.getHeaderProps()}
                        key={`${i}-${ii}`}
                        align={isCenter ? "center" : "right"}
                        style={{
                          opacity: `${opacity}`,
                        }}
                      >
                        {column.render("Header")}
                      </StyledTableCell>
                    )
                  } else {
                    return (
                      <StyledTableCell
                        {...column.getHeaderProps()}
                        key={`${i}-${ii}`}
                        align={isCenter ? "center" : "inherit"}
                        style={{ opacity: `${opacity}` }}
                      >
                        {column.render("Header")}
                      </StyledTableCell>
                    )
                  }
                })}
              </TableRow>
            ))}
          </TableHead>
        ) : null}
        <TableBody>
          {rows.map((row, i) => {
            prepareRow(row)
            let sRowArr = translateRow(row)
            return (
              <StyledTableRow {...row.getRowProps()} key={i}>
                {unFold ? (
                  row.cells.map((cell, ii) => {
                    if (unFold) {
                      if (ii) {
                        return (
                          <StyledTableCell
                            {...cell.getCellProps()}
                            key={`${i}-${ii}`}
                            align="right"
                          >
                            {cell.render("Cell")}
                          </StyledTableCell>
                        )
                      } else {
                        return (
                          <StyledTableCell
                            {...cell.getCellProps()}
                            key={`${i}-${ii}`}
                          >
                            {cell.render("Cell")}
                          </StyledTableCell>
                        )
                      }
                    }
                  })
                ) : (
                  <StyledTableCell>
                    {row.cells.map((cell, ii) => {
                      return (
                        <div
                          {...cell.getCellProps()}
                          key={`${i}-${ii}`}
                          style={{
                            display: "flex",
                          }}
                        >
                          {sRowArr[ii]
                            .slice(0, sRowArr[ii].length - 1)
                            .map((e, iii) => {
                              return (
                                <span
                                  key={`${i}-${ii}-${iii}`}
                                  style={{
                                    display: "inline-flex",
                                  }}
                                >
                                  <Typography variant="inherit">{e}</Typography>
                                  <ArrowRightIcon />
                                </span>
                              )
                            })}
                          <span
                            style={{
                              display: "inline-flex",
                            }}
                          >
                            <Typography variant="inherit">
                              {sRowArr[ii][sRowArr[ii].length - 1]}
                            </Typography>
                          </span>
                        </div>
                      )
                    })}
                  </StyledTableCell>
                )}
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SelectedMFTable
