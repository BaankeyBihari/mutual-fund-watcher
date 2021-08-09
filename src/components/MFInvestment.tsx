import { Fragment, useEffect, useState } from "react"

import Box from "@material-ui/core/Box/Box"
import Container from "@material-ui/core/Container/Container"
import { addDays, format, parse } from "date-fns"

import CTable from "@components/CTable"
import MFPerformanceChart from "@components/MFPerformanceChart"

type RecordDF = string | number | Date

export default function MFInvestment({
  selectedInvestmentSchemes,
  setSelectedInvestmentSchemes,
  investments,
  // setInvestments,
  tank,
  schemeKey,
}) {
  const roundTo2 = (n) => {
    return Math.round(n * 100) / 100
  }
  const roundTo3 = (n) => {
    return Math.round(n * 1000) / 1000
  }
  const [oldestDate, setOldestDate] = useState(new Date())
  const [latestDate, setLatestDate] = useState(new Date())
  const [dataFrame, setDataFrame] = useState([])
  useEffect(() => {
    if (investments.length) {
      let newSelectedInvestmentSchemes = [
        ...selectedInvestmentSchemes,
        ...investments.map((el) => {
          return { schemeCode: el.schemeCode, schemeName: el.schemeName }
        }),
      ].reduce((acc, scheme) => {
        const hasProduct = !!acc.find(
          (uniqueProduct) =>
            uniqueProduct.schemeCode === scheme.schemeCode &&
            uniqueProduct.schemeName === scheme.schemeName
        )
        if (!hasProduct) {
          return [...acc, scheme]
        }
        return acc
      }, [])
      setSelectedInvestmentSchemes(newSelectedInvestmentSchemes)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investments])
  // useEffect(() => {
  //   console.log("investments", investments)
  // }, [investments])
  // useEffect(() => {
  //   console.log("selectedInvestmentSchemes", selectedInvestmentSchemes)
  // }, [selectedInvestmentSchemes])
  //   const addInvestment = (data) => {
  //     setInvestments([...investments, data])
  //   }
  //   const removeInvestment = (index) => {
  //     setInvestments(investments.splice(index))
  //   }
  const [displayRows, setDisplayRows] = useState([])
  const [protfolios, setProtfolios] = useState({})
  useEffect(() => {
    if (investments.length && selectedInvestmentSchemes.length) {
      let pt = {}
      let dates = []
      selectedInvestmentSchemes.forEach((element) => {
        let ir = investments.filter((el) => {
          return (
            el.schemeCode == element.schemeCode &&
            el.schemeName == element.schemeName
          )
        })
        dates = [...dates, ...ir.reduce((tu, el) => [...tu, el.date], [])]
        let tunits = ir.reduce((tu, el) => {
          return (tu += el.units * (el.redeem ? -1 : 1))
        }, 0)
        let invested = ir.reduce((tu, el) => {
          if (!el.redeem) {
            return [...tu, { units: el.units, date: el.date }]
          }
          return tu
        }, [])
        let redeemed = ir.reduce((tu, el) => {
          if (el.redeem) {
            return [...tu, { units: el.units, date: el.date }]
          }
          return tu
        }, [])
        pt[schemeKey(element)] = {
          schemeCode: element.schemeCode,
          schemeName: element.schemeName,
          units: tunits,
          invested: invested,
          redeemed: redeemed,
        }
      })
      setOldestDate(
        dates.map((e) => parse(e, "dd-MM-yyyy", new Date())).sort()[0]
      )
      // console.log(
      //   "dates",
      //   dates.map((e) => parse(e, "dd-MM-yyyy", new Date())).sort()
      // )
      setProtfolios(pt)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investments, selectedInvestmentSchemes])

  useEffect(() => {
    if (selectedInvestmentSchemes.length) {
      let dr = []
      let avd = selectedInvestmentSchemes
        .filter((el) => {
          return tank.hasOwnProperty(el.schemeCode)
        })
        .filter((el) => {
          return protfolios.hasOwnProperty(schemeKey(el))
        })
      let ld = []
      avd.forEach((element) => {
        let k = schemeKey(element)
        if (tank.hasOwnProperty(element.schemeCode)) {
          let data = tank[element.schemeCode].data
          ld = [...ld, data[0].date]
          let invested = protfolios[k].invested
          let investment = roundTo2(
            invested.reduce((a, ele) => {
              let index = data.findIndex((el) => {
                return el.date === ele.date
              })
              if (index > -1) {
                return parseFloat(data[index].nav) * ele.units + a
              }
              return a
            }, 0)
          )
          let redeemed = protfolios[k].redeemed
          let earnings = roundTo2(
            redeemed.reduce((a, ele) => {
              let index = data.findIndex((el) => {
                return el.date === ele.date
              })
              if (index > -1) {
                return parseFloat(data[index].nav) * ele.units + a
              }
              return a
            }, 0)
          )
          let balanceUnits = roundTo3(
            invested.reduce((a, ele) => ele.units + a, 0) -
              redeemed.reduce((a, ele) => ele.units + a, 0)
          )
          let outstanding = roundTo2(balanceUnits * parseFloat(data[0].nav))
          dr.push({
            ...element,
            investment: investment,
            earnings: earnings,
            balanceUnits: balanceUnits,
            outstanding: outstanding,
            balance: roundTo2(outstanding + earnings - investment),
          })
        }
      })
      setDisplayRows(dr)
      setLatestDate(
        ld
          .map((e) => parse(e, "dd-MM-yyyy", new Date()))
          .sort()
          .reverse()[0]
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protfolios, selectedInvestmentSchemes, tank])

  useEffect(() => {
    if (oldestDate < latestDate) {
      let avdk = selectedInvestmentSchemes
        .filter((el) => {
          return tank.hasOwnProperty(el.schemeCode)
        })
        .filter((el) => {
          return protfolios.hasOwnProperty(schemeKey(el))
        })
        .map((el) => schemeKey(el))
      let ivd = investments
        .filter((el) => {
          let k = schemeKey(el)
          return avdk.indexOf(k) > -1
        })
        .sort((a, b) => {
          if (
            parse(a.date, "dd-MM-yyyy", new Date()) >
            parse(b.date, "dd-MM-yyyy", new Date())
          ) {
            return 1
          } else if (a == b) {
            return 0
          } else {
            return -1
          }
        })
      let dd = oldestDate
      let holdings = {}
      let investment = 0
      let lv = 0
      let dataFrame: RecordDF[][] = [["X", "Investment", "Valuation"]]
      while (dd < latestDate) {
        // console.log("dd", format(dd, "dd-MM-yyy"))
        let ddf = format(dd, "dd-MM-yyy")
        let fivd = ivd.filter((el) => {
          return el.date == ddf
        })
        if (fivd && fivd.length > 0) {
          fivd.forEach((el) => {
            if (!holdings.hasOwnProperty(el.schemeCode)) {
              holdings[el.schemeCode] = 0
            }
            if (el.redeem) {
              investment = roundTo2(
                investment -
                  el.units *
                    tank[el.schemeCode].data.find((elx) => elx.date == ddf).nav
              )
              holdings[el.schemeCode] -= el.units
            } else {
              investment = roundTo2(
                investment +
                  el.units *
                    tank[el.schemeCode].data.find((elx) => elx.date == ddf).nav
              )
              holdings[el.schemeCode] += el.units
            }
          })
          // console.log("ddx", format(dd, "dd-MM-yyy"), investment, holdings)
        }
        let cv = 0
        let change = false
        selectedInvestmentSchemes
          .filter((el) => {
            return tank.hasOwnProperty(el.schemeCode)
          })
          .filter((el) => {
            return protfolios.hasOwnProperty(schemeKey(el))
          })
          .filter((el) => {
            return holdings.hasOwnProperty(el.schemeCode)
          })
          .forEach((el) => {
            let rec = tank[el.schemeCode].data.find((el) => {
              return el.date == ddf
            })
            if (rec) {
              let nav = rec.nav
              change = true
              cv += roundTo2(holdings[el.schemeCode] * nav)
            }
          })
        if (!change) {
          cv = lv
        }
        lv = cv
        dataFrame.push([dd, investment, cv])
        // console.log("ddx", format(dd, "dd-MM-yyy"), investment, holdings, cv)
        dd = addDays(dd, 1)
      }
      // console.log("dataFrame", dataFrame)
      if (dataFrame.length > 1) {
        setDataFrame(dataFrame)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investments, tank, oldestDate, latestDate, selectedInvestmentSchemes])

  // useEffect(() => {
  //   console.log("protfolios", protfolios)
  // }, [protfolios])

  // useEffect(() => {
  //   console.log("displayRows", displayRows)
  // }, [displayRows])

  // useEffect(() => {
  //   console.log("selectedInvestmentSchemes", selectedInvestmentSchemes)
  // }, [selectedInvestmentSchemes])

  // useEffect(() => {
  //   console.log("oldestDate", oldestDate)
  // }, [oldestDate])

  // useEffect(() => {
  //   console.log("latesttDate", latestDate)
  // }, [latestDate])

  // useEffect(() => {
  //   console.log("dataFrame", dataFrame)
  // }, [dataFrame])
  return (
    <Fragment>
      {investments.length ? (
        <Container>
          <Box my={`MFInvestmentWindow`}>
            <CTable
              headers={[
                "Scheme",
                "Investment",
                "Redeemed",
                "Units",
                "Outstanding",
                "Net",
              ]}
              data={displayRows.map((el) => [
                schemeKey(el),
                el.investment,
                el.earnings,
                el.balanceUnits,
                el.outstanding,
                el.balance,
              ])}
            />
            <MFPerformanceChart
              data={dataFrame}
              xTitle={"Days"}
              yTitle={"Value"}
              chartType={"AreaChart"}
            />
          </Box>
        </Container>
      ) : null}
    </Fragment>
  )
}
