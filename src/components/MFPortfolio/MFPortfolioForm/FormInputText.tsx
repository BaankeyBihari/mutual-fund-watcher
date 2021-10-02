import React from "react"

import { TextField } from "@mui/material"
import { Controller } from "react-hook-form"

import { FormInputProps } from "./FormInputProps"

const FormInputText = ({ name, control, label }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          // helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
          placeholder="LOL"
        />
      )}
    />
  )
}

export default FormInputText
