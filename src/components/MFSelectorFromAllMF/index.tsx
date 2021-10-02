import * as React from "react"

import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd"
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded"
import CancelIcon from "@mui/icons-material/Cancel"
import { Autocomplete } from "@mui/material"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import { styled } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import consola from "consola"
import { matchSorter } from "match-sorter"
import getConfig from "next/config"

import schemeKey from "@helpers/schemeKey"
import useDebouncedSearch from "@hooks/useDebouncedSearch"
import useMFList from "@hooks/useMFList"
import { useStore } from "@hooks/useStore"

const PREFIX = "MFSelectorFromAllMF"

const classes = {
  root: `${PREFIX}-root`,
  highlighted: `${PREFIX}-highlighted`,
  button: `${PREFIX}-button`,
  rightIcon: `${PREFIX}-rightIcon`,
  chipContainer: `${PREFIX}-chipContainer`,
  chip: `${PREFIX}-chip`,
  chipLabel: `${PREFIX}-chipLabel`,
  paper: `${PREFIX}-paper`,
  comboboxStyles: `${PREFIX}-comboboxStyles`,
}

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.root}`]: {
    minHeight: "500",
  },

  [`& .${classes.highlighted}`]: {
    backgroundColor: "#bde4ff",
  },

  [`& .${classes.button}`]: {
    margin: theme.spacing(1),
  },

  [`& .${classes.rightIcon}`]: {
    marginLeft: theme.spacing(1),
  },

  [`& .${classes.chipContainer}`]: {
    backgroundColor: "transparent",
    display: "inline-block",
    marginBottom: 10,
  },

  [`& .${classes.chip}`]: {
    marginTop: 10,
    marginRight: 5,
    height: "100%",
    // width: "100%",
  },

  [`& .${classes.chipLabel}`]: {
    overflowWrap: "break-word",
    whiteSpace: "normal",
    textOverflow: "clip",
  },
}))

const ControlledChip = (props) => {
  const {
    item,
    removeItemFromSelected,
    key_id,
    bookmarkedSchemes,
    bookmarkScheme,
    removeBookmarkedScheme,
  } = props
  const [expand, setExpand] = React.useState(false)
  const toggleExpand = () => {
    expand ? setExpand(false) : setExpand(true)
  }
  const isBookmarked = bookmarkedSchemes.some(
    (e) => schemeKey(e) === schemeKey(item)
  )
  const bookmarkID = isBookmarked
    ? bookmarkedSchemes.find((e) => schemeKey(e) === schemeKey(item)).id
    : ""
  return (
    <Chip
      key={key_id}
      className={classes.chip}
      icon={
        isBookmarked ? (
          <div
            onClick={(e) => {
              e.stopPropagation()
              removeBookmarkedScheme(bookmarkID)
            }}
          >
            <BookmarkAddedIcon color="success" />
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation()
              bookmarkScheme(item)
            }}
          >
            <BookmarkAddIcon />
          </div>
        )
      }
      label={
        <Typography
          className={classes.chipLabel}
          style={{ whiteSpace: "normal" }}
        >
          {expand ? schemeKey(item) : schemeKey(item).slice(0, 30)}
          {expand && schemeKey(item).length > 30 ? "" : "..."}
        </Typography>
      }
      variant="outlined"
      deleteIcon={<CancelIcon />}
      onDelete={() => removeItemFromSelected(item.id)}
      onClick={() => toggleExpand()}
    />
  )
}

const renderChipList = (inputProps) => {
  const {
    selectedItems,
    removeItemFromSelected,
    bookmarkedSchemes,
    bookmarkScheme,
    removeBookmarkedScheme,
  } = inputProps
  return (
    <div className={classes.chipContainer}>
      {selectedItems.length > 0 &&
        selectedItems.map((item) => (
          <ControlledChip
            key={`chip-MFSelector-${schemeKey(item)}`}
            key_id={`chip-MFSelector-${schemeKey(item)}`}
            item={item}
            removeItemFromSelected={removeItemFromSelected}
            bookmarkedSchemes={bookmarkedSchemes}
            bookmarkScheme={bookmarkScheme}
            removeBookmarkedScheme={removeBookmarkedScheme}
          />
        ))}
    </div>
  )
}

const MFSelectorFromAllMF = () => {
  const { publicRuntimeConfig } = getConfig()
  const MF_SELECTOR_MAX_SLICE_SIZE_FOR_SUGGESTIONS = parseInt(
    publicRuntimeConfig.MF_SELECTOR_MAX_SLICE_SIZE_FOR_SUGGESTIONS
  )
  const MFListItems = useMFList({
    enabled: true,
  })
  const [allItems, setAllItems] = React.useState([])
  React.useEffect(() => {
    if (MFListItems.isSuccess) {
      if (MFListItems?.data) {
        if (MFListItems.data.length > 0) {
          setAllItems(MFListItems.data)
        } else {
          setAllItems([])
        }
      }
    }
  }, [MFListItems])

  const getSuggestions = (
    inputValue,
    { allItems, selectedItems, maxSlice }
  ) => {
    consola.debug(
      "getSuggestions",
      inputValue,
      allItems,
      selectedItems,
      maxSlice
    )
    let filteredItems = []
    if (allItems) {
      filteredItems = allItems.filter(
        (item) => !selectedItems.some((x) => schemeKey(x) === schemeKey(item))
      )
    }
    return matchSorter(filteredItems ? filteredItems : [], inputValue, {
      keys: ["schemeCode", "schemeName"],
    }).slice(0, maxSlice)
  }

  const {
    inputText: inputValue,
    setInputText: setInputValue,
    searchResults,
    configSearch,
    setConfigSearch,
  } = useDebouncedSearch(getSuggestions)

  const [inputItems, setInputItems] = React.useState([])
  const {
    selectedSchemes: selectedItems,
    bookmarkedSchemes,
    bookmarkScheme,
    removeSelectedScheme: removeItemFromSelected,
    selectScheme: addSchemeSelected,
    removeBookmarkedScheme,
  } = useStore()
  const [value, setValue] = React.useState<any | null>(null)
  React.useEffect(() => {
    if (searchResults.result) {
      setInputItems(searchResults.result)
    }
  }, [searchResults.result])

  React.useEffect(() => {
    setConfigSearch({
      allItems,
      selectedItems,
      maxSlice: MF_SELECTOR_MAX_SLICE_SIZE_FOR_SUGGESTIONS,
    })
  }, [
    MF_SELECTOR_MAX_SLICE_SIZE_FOR_SUGGESTIONS,
    allItems,
    selectedItems,
    setConfigSearch,
  ])

  React.useEffect(() => {
    consola.debug("configSearch", configSearch)
  }, [configSearch])
  return (
    <StyledGrid container>
      <Grid item xs={12}>
        {renderChipList({
          selectedItems,
          removeItemFromSelected,
          classes,
          bookmarkedSchemes,
          bookmarkScheme,
          removeBookmarkedScheme,
        })}
      </Grid>
      <Grid item xs={12}>
        <Autocomplete
          loading={searchResults.loading}
          sx={{ width: "100%" }}
          value={value}
          getOptionLabel={(option) =>
            option?.schemeCode
              ? `${option.schemeCode}: ${option.schemeName}`
              : ""
          }
          onChange={(_event: any, newValue: any) => {
            consola.debug("Value", newValue)
            newValue && addSchemeSelected(newValue)
            newValue && setValue(null)
            setInputValue("")
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue: string) => {
            setInputValue(newInputValue)
          }}
          options={inputItems}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Mutual Fund"
              placeholder="Start typing..."
            />
          )}
        />
      </Grid>
    </StyledGrid>
  )
}

export default MFSelectorFromAllMF
