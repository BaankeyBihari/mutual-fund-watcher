import { Fragment } from "react"

import { Chart } from "react-google-charts"
const MFChart = (props) => {
  return (
    <Fragment>
      {props.data.length ? (
        <Chart
          width={"100%"}
          //   height={"400px"}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={props.data}
          options={{
            hAxis: {
              title: props.xTitle,
            },
            vAxis: {
              title: props.yTitle,
            },
            series: {
              1: { curveType: "function" },
              0: { curveType: "function" },
            },
          }}
        />
      ) : null}
    </Fragment>
  )
}
export default MFChart
