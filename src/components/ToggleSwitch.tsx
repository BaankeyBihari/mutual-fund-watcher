import React, { ChangeEvent, Fragment, useState } from "react"

import Switch from "@material-ui/core/Switch"

export default function ToggleSwitch(props) {
  const [state, setState] = useState(props.inputState || false)
  const onInputChange = props.onInputChange

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState(event.target.checked)
    if (onInputChange) {
      onInputChange(event.target.checked)
    }
  }

  return (
    <Fragment>
      <Switch
        checked={state}
        onChange={handleChange}
        name="checkedA"
        inputProps={{ "aria-label": "secondary checkbox" }}
      />
    </Fragment>
  )
}
