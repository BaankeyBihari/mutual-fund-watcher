import React from "react"

import Paper from "@mui/material/Paper"
import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { useTable } from "react-table"

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

const MuTable = (props) => {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    ...props,
  })
  // Render the UI for your table
  return (
    <TableContainer component={Paper}>
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup, i) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, ii) => {
                if (ii) {
                  return (
                    <StyledTableCell
                      {...column.getHeaderProps()}
                      key={`${i}-${ii}`}
                      align={"right"}
                    >
                      {column.render("Header")}
                    </StyledTableCell>
                  )
                } else {
                  return (
                    <StyledTableCell
                      {...column.getHeaderProps()}
                      key={`${i}-${ii}`}
                    >
                      {column.render("Header")}
                    </StyledTableCell>
                  )
                }
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <StyledTableRow {...row.getRowProps()} key={i}>
                {row.cells.map((cell, ii) => {
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
                })}
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default MuTable
