import React from "react"

import ScopedCssBaseline from "@mui/material/ScopedCssBaseline"
import consola from "consola"
import { AppProps } from "next/app"
import getConfig from "next/config"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import { Hydrate } from "react-query/hydration"

import { useCreateStore, ZustandProvider } from "@hooks/useStore"

import "@styles/tailwind.scss"

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { publicRuntimeConfig } = getConfig()
  consola.level = publicRuntimeConfig.CONSOLA_LEVEL
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime:
              parseInt(publicRuntimeConfig.MF_UPDATE_EXPIRY_IN_SECONDS) * 2000,
            refetchInterval:
              parseInt(publicRuntimeConfig.MF_UPDATE_EXPIRY_IN_SECONDS) * 1000,
          },
        },
      })
  )

  const createStore = useCreateStore(
    pageProps?.initialZustandState ? pageProps.initialZustandState : {}
  )

  return (
    <ZustandProvider createStore={createStore}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <ScopedCssBaseline>
            <Component {...pageProps} />
          </ScopedCssBaseline>
          <ReactQueryDevtools initialIsOpen />
        </Hydrate>
      </QueryClientProvider>
    </ZustandProvider>
  )
}

export default MyApp
