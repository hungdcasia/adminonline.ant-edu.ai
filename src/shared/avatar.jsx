import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
let noAvatar = "/assets/images/no-avatar.png";
const Avatar = ({ url, className, rawProps }) => {
    // const { url, className } = props;
    let [url2, setUrl2] = useState(url);
    useEffect(() => {
        setUrl2(url);
    }, [url]);
    return (
        <img src={url2 ?? noAvatar}
            onError={() => setUrl2(noAvatar)}
            className={className ?? ''}
            {...rawProps} />
    )
}


export { Avatar };