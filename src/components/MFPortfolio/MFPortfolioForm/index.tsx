import React from "react"

import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import consola from "consola"
import { useForm } from "react-hook-form"

import MFSelectorFromAllMF from "@components/MFSelectorFromAllMF"

import FormInputDate from "./FormInputDate"
// import { FormInputDropdown } from "./FormInputDropdown"
// import { FormInputMultiCheckbox } from "./FormInputMultiCheckbox"
// import { FormInputRadio } from "./FormInputRadio"
// import { FormInputSlider } from "./FormInputSlider"
import FormInputText from "./FormInputText"

interface IFormInput {
  textValue: string
  radioValue: string
  checkboxValue: string[]
  tradeDate: Date
  dropdownValue: string
  sliderValue: number
}

const defaultValues = {
  textValue: "",
  radioValue: "",
  checkboxValue: [],
  tradeDate: new Date(),
  dropdownValue: "",
  sliderValue: 0,
}
const MFPortfolioForm = () => {
  const methods = useForm<IFormInput>({ defaultValues: defaultValues })
  // eslint-disable-next-line no-unused-vars
  const { handleSubmit, reset, control, setValue, watch } = methods
  const onSubmit = (data: IFormInput) => consola.debug("data", data)

  return (
    <Paper
      style={{
        display: "grid",
        gridRowGap: "20px",
        padding: "40px",
        margin: "30px",
      }}
    >
      <MFSelectorFromAllMF />
      <Typography variant="h6"> Form Demo</Typography>

      <FormInputText name="textValue" control={control} label="Text Input" />
      {/* <FormInputRadio
        name={"radioValue"}
        control={control}
        label={"Radio Input"}
      /> */}
      {/* <FormInputDropdown
        name="dropdownValue"
        control={control}
        label="Dropdown Input"
      /> */}
      <FormInputDate name="tradeDate" control={control} label="Trade Date" />
      {/* <FormInputMultiCheckbox
        control={control}
        setValue={setValue}
        name={"checkboxValue"}
        label={"Checkbox Input"}
      />
      <FormInputSlider
        name={"sliderValue"}
        control={control}
        setValue={setValue}
        label={"Slider Input"}
      /> */}

      <Button onClick={handleSubmit(onSubmit)} variant={"contained"}>
        {" "}
        Submit{" "}
      </Button>
      <Button onClick={() => reset()} variant={"outlined"}>
        {" "}
        Reset{" "}
      </Button>
    </Paper>
  )
}

export default MFPortfolioForm
