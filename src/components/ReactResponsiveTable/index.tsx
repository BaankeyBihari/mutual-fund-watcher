import React from "react"

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

const ReactResponsiveTable = (props) => {
  const { header, rows } = props
  return (
    <Table>
      <Thead>
        <Tr>
          {header.map((e, i) => (
            <Th key={i}>{e}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row, i) => {
          return (
            <Tr key={i}>
              {row.map((field, j) => {
                return <Td key={`${i}-${j}`}>{field}</Td>
              })}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

export default ReactResponsiveTable
