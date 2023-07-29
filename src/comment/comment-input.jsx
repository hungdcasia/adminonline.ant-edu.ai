import { useState, useEffect, useRef } from "react";
import { Avatar } from "../shared";
import { connect } from "react-redux";
import ContentEditable from "react-contenteditable";

const CommentInput = (props) => {
    let { authentication, onCommentOk, onCommentCancel, placeholder, autoFocus, innerRef } = props;
    let [content, setContent] = useState('');
    const commentOkClick = () => {
        onCommentOk(content);
        setContent('');
    };
    var input = useRef();

    useEffect(() => {
        if (autoFocus)
            innerRef.current.focus();
    }, []);

    return (
        <div className="CommentBox_commentWrapper">
            <Avatar url={authentication.userInfomation?.avatar} className="CommentBox_myAvatar" />
            <textarea
                className="Text_text CommentBox_commentInput w-100 border rounded-lg"
                ref={innerRef}
                placeholder={placeholder}
                value={content}
                style={{ resize: 'none' }}
                onChange={(e) => { setContent(e.target.value) }}
            />
            <div className="CommentBox_actionWrapper">
                <button className="CommentBox_cancel" onClick={() => { setContent(''); onCommentCancel?.call(); }}>Hủy</button>
                <button className={`CommentBox_ok ${content && 'CommentBox_active'}`} onClick={commentOkClick}>Bình luận</button>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return { authentication: state.authentication };
}

const connectedPage = connect(mapStateToProps, {})(CommentInput);

export { connectedPage as CommentInput };