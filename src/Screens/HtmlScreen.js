import React from 'react'
import failedHtmlSource from '../HtmlSourceCode/failedHtmlCode.html'
var htmlDoc = { __html: failedHtmlSource };

function HtmlScreen() {
    return (
        <>
            <div dangerouslySetInnerHTML={htmlDoc} ></div>
        </>
    )
}

export default HtmlScreen