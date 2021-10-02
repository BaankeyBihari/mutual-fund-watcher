// Generic reusable hook
// https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js

import * as React from "react"

import AwesomeDebouncePromise from "awesome-debounce-promise"
import { useAsync } from "react-async-hook"
import useConstant from "use-constant"

const useDebouncedSearch = (searchFunction, debounceTime = 300) => {
  // Handle the input text state
  const [inputText, setInputText] = React.useState("")
  const [configSearch, setConfigSearch] = React.useState({})

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, debounceTime)
  )

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  //   const searchResults = useAsync(async () => {
  //     if (inputText.length === 0) {
  //       return []
  //     } else {
  //       return debouncedSearchFunction(inputText)
  //     }
  //   }, [debouncedSearchFunction, inputText])
  const searchResults = useAsync(async () => {
    return debouncedSearchFunction(inputText, configSearch)
  }, [debouncedSearchFunction, inputText, configSearch])

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    configSearch,
    setConfigSearch,
    searchResults,
  }
}

export default useDebouncedSearch
