import React, { Component, useState, useEffect } from 'react';
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allShareButton from "react-share";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { alertActions } from "../actions";
import { Avatar } from "../shared";
import { CommentItem, CommentInput } from "../comment";
import { commentService } from "../services";

const CourseComment = (props) => {
    const { authentication, course } = props;
    const { loggedIn, userInfomation } = authentication;
    let [comments, setComments] = useState([]);
    let [isEnd, setIsEnd] = useState(false);
    useEffect(() => {
        // commentService.getComments(1, course.id, 0, 0)
        //     .then(res => {
        //         setComments(res.data);
        //     });
        loadMore();
    }, []);
    const onCommentOk = (content) => {
        commentService.comment(1, course.id, 0, content)
            .then(res => {
                var newComment = res.data;
                setComments([newComment].concat(comments));
            });
    };

    const loadMore = () => {
        if (!isEnd) {
            let from = comments.last()?.id ?? 0;
            commentService.getComments(1, course.id, 0, from)
                .then(res => {
                    let result = comments.concat(res.data);
                    if (res.data.length < 10) setIsEnd(true);
                    setComments(result);
                });
        }
    }

    return (
        <div className="CourseDetail_commentBlock">
            <div className="Comment_detailRow">
                <div className="Comment_contentHeading">
                    {/* <h4>94 đánh giá</h4> */}
                    <div className="Comment_shareBlock">
                        <span className="Comment_shareLabel">CHIA SẺ</span>
                        <div className="Comment_shareBtn Comment_shareBtnFb" title="Chia sẻ khóa học qua Facebook">
                            <allShareButton.FacebookShareButton
                                url={window.location.href}
                                title="Chia sẻ khóa học qua Facebook"
                                style={{ width: '100%' }}>
                                <FontAwesomeIcon icon={faFacebook} className="fa-w-10 Comment_icon" />
                            </allShareButton.FacebookShareButton>
                        </div>
                        <div className="Comment_shareBtn Comment_shareBtnMail" title="Chia sẻ khóa học qua Mail">
                            <a href={`mailto:?subject=${course?.name}&body=${window.location.href}`}
                                title="Share by Email" style={{ width: '100%', display: 'flex' }}>
                                <FontAwesomeIcon icon={allIcon.faEnvelope} className="fa-w-10 Comment_icon" />
                            </a>
                        </div>
                        <CopyToClipboard text={window.location.href} onCopy={() => { alertActions.success("Sao chép liên kết thành công") }}>
                            <div className="Comment_shareBtn Comment_shareBtnLink"
                                title="Chia sẻ khóa học qua Liên kết">
                                <FontAwesomeIcon icon={allIcon.faLink} className="fa-w-10 Comment_icon" />
                            </div>
                        </CopyToClipboard>
                    </div>
                </div>
                {loggedIn &&
                    <CommentInput onCommentOk={onCommentOk} placeholder="Bạn nghĩ gì về khóa học này?"/>
                }
                {comments.map(item =>
                    <CommentItem type={1} objectId={course.id} key={item.id} comment={item} />
                )}
                {!isEnd && <div className="Comment_loadMoreBlock" onClick={loadMore}>Xem thêm đánh giá</div>}
            </div>
        </div >
    );
}

function mapStateToProps(state) {
    return { authentication: state.authentication };
}

const connectedPage = connect(mapStateToProps, {})(CourseComment);

export { connectedPage as CourseComment };
