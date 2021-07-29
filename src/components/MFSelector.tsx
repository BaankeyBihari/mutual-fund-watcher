import React, {
  Children,
  cloneElement,
  ComponentType,
  createContext,
  forwardRef,
  Fragment,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react"
import { useState } from "react"

import { Typography } from "@material-ui/core"
import { CircularProgress } from "@material-ui/core"
import ListSubheader from "@material-ui/core/ListSubheader"
import { useTheme, makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from "@material-ui/lab/Autocomplete"
import fetch from "isomorphic-unfetch"
import { VariableSizeList, ListChildComponentProps } from "react-window"

const LISTBOX_PADDING = 8 // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props
  return cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  })
}

const OuterElementContext = createContext({})

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext)
  return <div ref={ref} {...props} {...outerProps} />
})

function useResetCache(data: any) {
  const ref = useRef<VariableSizeList>(null)
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

// Adapter for react-window
const ListboxComponent = forwardRef<HTMLDivElement>(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props
  const itemData = Children.toArray(children)
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true })
  const itemCount = itemData.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = (child: ReactNode) => {
    if (isValidElement(child) && child.type === ListSubheader) {
      return 48
    }

    return itemSize
  }

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
  }

  const gridRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})

function random(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

const useStyles = makeStyles({
  listbox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 2,
    },
  },
})

const renderGroup = (params: AutocompleteRenderGroupParams) => [
  <ListSubheader key={params.key} component="div">
    {params.group}
  </ListSubheader>,
  params.children,
]

export default function Virtualize(props) {
  const classes = useStyles()
  const [mfData, setMFData] = useState([])
  const [mfDefaultData, setMFDefaultData] = useState([])

  useEffect(() => {
    const getData = async () => {
      fetch(`https://api.mfapi.in/mf`)
        .then((r) => r.json())
        .then((data) => {
          // console.log("API", data)
          setMFData(data)
        })
    }
    getData()
  }, [])

  useEffect(() => {
    // console.log("mfData: ", mfData)
    if (mfData.length) {
      setMFDefaultData(
        mfData.filter((o) => {
          if (props?.selectedSchemes) {
            return props.selectedSchemes.includes(o.schemeCode)
          }
          return false
        })
      )
    }
  }, [mfData, props])

  //   useEffect(() => {
  //     console.log("mfDefaultData: ", mfDefaultData)
  //   }, [mfDefaultData])

  const handDataChange = (newValue) => {
    setMFDefaultData(newValue)
    if (props?.dataChangeHandler) {
      props.dataChangeHandler(newValue)
    }
  }

  return (
    <Fragment>
      {mfData.length ? (
        <Autocomplete
          id="virtualize-demo"
          multiple
          value={mfDefaultData}
          onChange={(_, newValue) => {
            handDataChange(newValue)
          }}
          filterSelectedOptions
          style={{ width: 1000 }}
          disableListWrap
          classes={classes}
          ListboxComponent={
            ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>
          }
          renderGroup={renderGroup}
          options={mfData}
          getOptionLabel={(option) => {
            return `${option.schemeCode} - ${option.schemeName}`
          }}
          //   groupBy={(option) => option.schemeName.toUpperCase()}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="10,000 options" />
          )}
          renderOption={(option) => (
            <Typography
              noWrap
            >{`${option.schemeCode} - ${option.schemeName}`}</Typography>
          )}
        />
      ) : (
        <CircularProgress />
      )}
    </Fragment>
  )
}
