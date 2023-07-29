import React, { PureComponent, useEffect } from "react"
// import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import throttle from "lodash.throttle"
import { useRef } from "react"
import { useState } from "react"

const PdfComponent = ({ pdfFile }) => {
    let wrapper = useRef()
    let [pdfWidth, setPdfWidth] = useState()
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
        onResize()
    }

    const onResize = () => {
        if (wrapper) {
            setPdfWidth(wrapper.current.getBoundingClientRect().width)
        }
    }

    const throttleResize = throttle(onResize, 500)

    useEffect(() => {
        window.addEventListener("resize", throttleResize)
        return () => {
            window.removeEventListener("resize", throttleResize)
        }
    }, [])

    return (
        <div className='pdf-viewer-wrapper' ref={wrapper}>
            {/* <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {
                    Array.from(
                        new Array(numPages),
                        (el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                width={pdfWidth}
                            />
                        ),
                    )
                }
            </Document> */}
        </div >
    )
}

export default PdfComponent