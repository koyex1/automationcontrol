import React from 'react'
import logReport from '../logReport/logReport.txt'
import logReportHtml from '../logReport/logReport.html'
var htmlDoc = { __html: logReportHtml};

function logScreen() {
  return (
    <div dangerouslySetInnerHTML={htmlDoc} ></div>
  )
}

export default logScreen