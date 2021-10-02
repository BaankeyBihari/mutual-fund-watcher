import consola from "consola"
import { useQueries } from "react-query"

const getData = async (sc) => {
  consola.debug(`fetching mf ${sc}`)
  const data = await fetch(`https://api.mfapi.in/mf/${sc}`)
  return await data.json()
}

export default function useMF(items: any[], config: {}) {
  return useQueries(
    items.map((e) => {
      return {
        queryKey: ["MF", e],
        queryFn: () => getData(e),
        ...config,
      }
    })
  )
}
