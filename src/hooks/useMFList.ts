import consola from "consola"
import { useQuery } from "react-query"

const getData = async () => {
  consola.debug("fetching mfList")
  const data = await fetch(`https://api.mfapi.in/mf`)
  return (await data.json()).map((e) => {
    return {
      schemeCode: e.schemeCode,
      schemeName: e.schemeName.split("-").join(" - "),
    }
  })
}

export default function useMFList(config: {}) {
  return useQuery("MFList", () => getData(), config)
}
