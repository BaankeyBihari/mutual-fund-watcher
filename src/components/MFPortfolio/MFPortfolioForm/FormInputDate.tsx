import React from "react"

import AdapterDateFns from "@mui/lab/AdapterDateFns"
import DatePicker from "@mui/lab/DatePicker"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import TextField from "@mui/material/TextField"
import { Controller } from "react-hook-form"

import { FormInputProps } from "@components/MFPortfolio/MFPortfolioForm/FormInputProps"

const FormInputDate = ({ name, control, label }: FormInputProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            label={label}
            renderInput={(params) => <TextField {...params} />}
            maxDate={new Date()}
            // defaultValue={new Date()}
            // label={label}
            // rifmFormatter={(val) => val.replace(/[^[a-zA-Z0-9-]*$]+/gi, "")}
            // autoOk
            // KeyboardButtonProps={{
            //   "aria-label": "change date",
            // }}
            // format={DATE_FORMAT}
            {...field}
          />
        )}
      />
    </LocalizationProvider>
  )
}
export default FormInputDate
