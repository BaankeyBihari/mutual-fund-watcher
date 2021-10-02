import { useLayoutEffect } from "react"

import consola from "consola"
import { produce } from "immer"
import { v4 as uuidv4 } from "uuid"
import create, { SetState, GetState } from "zustand"
import createContext from "zustand/context"
import { devtools } from "zustand/middleware"

type schemeInterface = {
  id?: string
  schemeName: string
  schemeCode: number
}

type orderRecord = {
  id?: string
  date: Date
  units: number
}

type investmentFolio = {
  folioID: string
  scheme: schemeInterface
  records?: orderRecord[]
  agent?: string
}

type storeInterface = {
  enabledSchemes: number[]
  disabledSchemes: number[]
  selectedSchemes: schemeInterface[]
  investments: investmentFolio[]
  bookmarkedSchemes: schemeInterface[]
  updateEnabledSchemes: () => void
  // eslint-disable-next-line no-unused-vars
  selectSchemes: (v: schemeInterface[]) => void
  // eslint-disable-next-line no-unused-vars
  selectScheme: (v: schemeInterface) => void
  // eslint-disable-next-line no-unused-vars
  removeSelectedScheme: (v: string) => void
  // eslint-disable-next-line no-unused-vars
  bookmarkSchemes: (v: schemeInterface[]) => void
  // eslint-disable-next-line no-unused-vars
  bookmarkScheme: (v: schemeInterface) => void
  // eslint-disable-next-line no-unused-vars
  removeBookmarkedScheme: (v: string) => void
  // eslint-disable-next-line no-unused-vars
  loadFolio: (v: investmentFolio[], strict: boolean) => void
  // eslint-disable-next-line no-unused-vars
  createFolio: (v: investmentFolio) => void
  // eslint-disable-next-line no-unused-vars
  deleteFolio: (v: string) => void
  // eslint-disable-next-line no-unused-vars
  addInvestmentToFolio: (v: orderRecord, fID: string) => void
  // eslint-disable-next-line no-unused-vars
  deleteInvestment: (id: string) => void
}

let store

const initialState = {
  enabledSchemes: [],
  disabledSchemes: [],
  selectedSchemes: [],
  investments: [],
  bookmarkedSchemes: [],
}

const zustandContext = createContext<storeInterface>()
export const ZustandProvider = zustandContext.Provider
/** @type {import('zustand/index').UseStore<storeInterface>} */
export const useStore = zustandContext.useStore

// Log every time state is changed
const log = (config) => (set, get, api) =>
  config(
    (args) => {
      consola.debug("  applying", args)
      set(args)
      consola.debug("  new state", get())
    },
    get,
    api
  )

// Turn the set method into an immer proxy
const immer = (config) => (set, get, api) =>
  config(
    (partial, replace) => {
      const nextState =
        typeof partial === "function" ? produce(partial) : partial
      return set(nextState, replace)
    },
    get,
    api
  )

export const initializeStore = (preloadedState = {}) => {
  const Store = log(
    immer((set: SetState<storeInterface>, get: GetState<storeInterface>) => ({
      ...initialState,
      ...preloadedState,
      updateEnabledSchemes: (): void => {
        let activeSchemeCodes = get().selectedSchemes.reduce((arr, e) => {
          if (arr.indexOf(e.schemeCode) === -1) {
            return [...arr, e.schemeCode]
          }
          return arr
        }, [])
        activeSchemeCodes = get().investments.reduce((arr, e) => {
          if (arr.indexOf(e.scheme.schemeCode) === -1) {
            return [...arr, e.scheme.schemeCode]
          }
          return arr
        }, activeSchemeCodes)
        activeSchemeCodes = get().bookmarkedSchemes.reduce((arr, e) => {
          if (arr.indexOf(e.schemeCode) === -1) {
            return [...arr, e.schemeCode]
          }
          return arr
        }, activeSchemeCodes)
        consola.debug("setEnabledSchemes:activeSchemeCodes", activeSchemeCodes)
        let toDisable = [...get().enabledSchemes, ...get().disabledSchemes]
          .filter((e) => !activeSchemeCodes.some((ele: any) => ele === e))
          .reduce((arr, e) => {
            if (arr.indexOf(e) === -1) {
              return [...arr, e]
            }
            return arr
          }, [])
          .filter((e) => !get().disabledSchemes.some((ele: any) => ele === e))
        consola.debug("setEnabledSchemes:toDisable", toDisable)
        if (toDisable?.length) {
          set({
            disabledSchemes: toDisable,
          })
        }
        set({
          enabledSchemes: activeSchemeCodes,
        })
      },
      selectSchemes: (v: schemeInterface[]): void => {
        let newSchemes = []
        v.forEach((e) => {
          if (
            !get().selectedSchemes.some(
              (x) =>
                x.schemeCode === e.schemeCode && x.schemeName === e.schemeName
            )
          ) {
            newSchemes.push(e)
          }
        })
        consola.debug("selectSchemes:newSchemes", newSchemes)
        consola.debug("selectSchemes:provided", v)
        if (newSchemes.length) {
          set({
            selectedSchemes: [
              ...get().selectedSchemes,
              ...newSchemes.map((e) => {
                return { ...e, id: uuidv4() }
              }),
            ],
          })
          get().updateEnabledSchemes()
        }
      },
      selectScheme: (v: schemeInterface): void => {
        get().selectSchemes([v])
      },
      removeSelectedScheme: (v: string): void => {
        consola.debug("removeSelectedScheme", v, get().selectedSchemes)
        set({
          selectedSchemes: [...get().selectedSchemes.filter((e) => e.id !== v)],
        })
        get().updateEnabledSchemes()
      },
      bookmarkSchemes: (v: schemeInterface[]): void => {
        let newSchemes = []
        v.forEach((e) => {
          if (
            !get().bookmarkedSchemes.some(
              (x) =>
                x.schemeCode === e.schemeCode && x.schemeName === e.schemeName
            )
          ) {
            newSchemes.push(e)
          }
        })
        consola.debug("bookmarkSchemes:newSchemes", newSchemes)
        consola.debug("bookmarkSchemes:provided", v)
        if (newSchemes.length) {
          set({
            bookmarkedSchemes: [
              ...get().bookmarkedSchemes,
              ...newSchemes.map((e) => {
                return { ...e, id: uuidv4() }
              }),
            ],
          })
          get().updateEnabledSchemes()
        }
      },
      bookmarkScheme: (v: schemeInterface): void => {
        get().bookmarkSchemes([v])
      },
      removeBookmarkedScheme: (v: string): void => {
        consola.debug("removeBookmarkedScheme", v, get().bookmarkedSchemes)
        set({
          bookmarkedSchemes: [
            ...get().bookmarkedSchemes.filter((e) => e.id !== v),
          ],
        })
      },
      loadFolio: (v: investmentFolio[], strict: boolean) => {
        if (strict) {
          v = v.filter((e) => {
            let present = true
            present &&= "folioID" in e
            present &&=
              "scheme" in e &&
              "schemeCode" in e.scheme &&
              "schemeName" in e.scheme
            if ("records" in e) {
              present &&= e.records.every(
                (ee) => "units" in ee && "date" in ee && "id" in ee
              )
            }
            return present
          })
        }
        v = v.map((e) => {
          if ("records" in e && e.records.length > 0) {
            return {
              ...e,
              records: e.records.map((ee) => {
                if (strict) {
                  return ee
                } else {
                  return {
                    ...ee,
                    id: uuidv4(),
                  }
                }
              }),
            }
          }
        })
        set({
          investments: [...v],
        })
        get().updateEnabledSchemes()
      },
      createFolio: (v: investmentFolio) => {
        let present = get().investments.find((e) => e.folioID === v.folioID)
        if (!present) {
          set({
            investments: [
              ...get().investments,
              {
                ...v,
                records: v.records.map((e) => ({
                  ...e,
                  id: uuidv4(),
                })),
              },
            ],
          })
          get().updateEnabledSchemes()
        }
      },
      deleteFolio: (v: string) => {
        set({
          investments: [...get().investments.filter((e) => e.folioID !== v)],
        })
        get().updateEnabledSchemes()
      },
      addInvestmentToFolio: (v: orderRecord, fID: string) => {
        set({
          investments: [
            ...get().investments.map((e) => {
              if (e.folioID !== fID) {
                return e
              }
              return {
                ...e,
                records: [
                  ...e.records,
                  {
                    ...v,
                    id: uuidv4(),
                  },
                ],
              }
            }),
          ],
        })
        get().updateEnabledSchemes()
      },
      deleteInvestment: (id: string) => {
        set({
          investments: get().investments.map((e) => ({
            ...e,
            records: e.records.filter((ee) => ee.id !== id),
          })),
        })
        get().updateEnabledSchemes()
      },
    }))
  )
  return create<storeInterface>(
    process.env.NODE_ENV === "development" ? devtools(Store) : Store
  )
}

export function useCreateStore(initialState) {
  // For SSR & SSG, always use a new store.
  if (typeof window === "undefined") {
    return () => initializeStore(initialState)
  }
  // For CSR, always re-use same store.
  store = store ?? initializeStore(initialState)
  // And if initialState changes, then merge states in the next render cycle.
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (initialState && store) {
      if (initialState?.version === store.getState().version) {
        store.setState({
          ...store.getState(),
          ...initialState,
        })
      } else {
        store.setState({
          ...initialState,
        })
      }
    }
  }, [initialState])
  return () => store
}
