import React, { Fragment, useRef } from "react"

export default function MFDataImportExport(props) {
  const setSelectedSchemes = props.setSelectedSchemes
  const selectedSchemes = props.selectedSchemes
  const fileField = useRef(null)

  const upload = (e) => {
    e.preventDefault()
    fileField.current.click()
  }

  const openFile = (evt) => {
    let status = [] // Status output
    const fileObj = evt.target.files[0]
    const reader = new FileReader()

    let fileloaded = (e) => {
      // e.target.result is the file's content as text
      const fileContents = e.target.result
      status.push(
        `File name: "${fileObj.name}". Length: ${fileContents.length} bytes.`
      )
      // Show first 80 characters of the file
      let jsonData = JSON.parse(fileContents)
      // console.log("jsonData", jsonData)
      if (jsonData?.selectedSchemes) {
        setSelectedSchemes(jsonData.selectedSchemes)
      }
    }

    // Mainline of the method
    fileloaded = fileloaded.bind(this)
    reader.onload = fileloaded
    reader.readAsText(fileObj)
  }

  const exportToJson = (objectData: any) => {
    let filename = "export.json"
    let contentType = "application/json;charset=utf-8;"
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob(
        [decodeURIComponent(encodeURI(JSON.stringify(objectData, null, 4)))],
        { type: contentType }
      )
      navigator.msSaveOrOpenBlob(blob, filename)
    } else {
      var a = document.createElement("a")
      a.download = filename
      a.href =
        "data:" +
        contentType +
        "," +
        encodeURIComponent(JSON.stringify(objectData, null, 4))
      a.target = "_blank"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <Fragment>
      {selectedSchemes.length ? (
        <button
          onClick={() => {
            exportToJson({ selectedSchemes: selectedSchemes })
          }}
        >
          {`Download Json`}
        </button>
      ) : null}

      <p>
        <button onClick={upload}>Upload a file!</button> Only json files are ok.
      </p>

      <input
        type="file"
        className="hidden"
        multiple={false}
        accept=".json,.csv,.txt,.text,application/json,text/csv,text/plain"
        onChange={(evt) => openFile(evt)}
        ref={fileField}
      />
    </Fragment>
  )
}