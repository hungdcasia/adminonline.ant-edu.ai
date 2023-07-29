import React, { useEffect } from "react";
import loadLibrary from './load-library'
var ReactDOM = require('react-dom');

const ZaloChatWidget = React.memo(function ZaloChatWidget(props) {

    useEffect(() => {
        loadLibrary().then(() => { })
    }, [])

    // return ReactDOM.createPortal(
    //     <div className="zalo-chat-widget"
    //         data-oaid="1764728722720884658"
    //         data-welcome-message="Rất vui khi được hỗ trợ bạn!"
    //         data-autopopup="0"></div>,
    //     document.getElementsByTagName("body")[0]
    // );

    return (
        // <div className="zalo-chat-widget"
        //     data-oaid="1764728722720884658"
        //     data-welcome-message="Rất vui khi được hỗ trợ bạn!"
        //     data-autopopup="0"
        //     data-width=""
        //     data-height="">

        // </div>
        <></>
    )
});

export default ZaloChatWidget