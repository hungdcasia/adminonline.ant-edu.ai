import React, { Component, useState, useEffect } from 'react';
import { connect } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import * as allIconBrand from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { NumberHelpers } from "../helpers/index";
import { courseService, commentService } from "../services";
import Moment from 'react-moment';
import moment from 'moment';
import { alertActions } from "../actions";
import * as allShareButton from "react-share";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Avatar } from "../shared";
import { CommentInput, CommentItem } from "../comment";
import { useSelector } from 'react-redux';

const LessonComment = ({ currentLesson }) => {
    let [comments, setComments] = useState([]);
    let [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        comments = []
        isEnd = false
        loadMore();
    }, [currentLesson]);

    const onCommentOk = (content) => {
        commentService.comment(2, currentLesson.id, 0, content)
            .then(res => {
                var newComment = res.data;
                setComments([newComment].concat(comments));
            });
    };

    const loadMore = () => {
        if (!isEnd) {
            let from = comments.last()?.id ?? 0;
            commentService.getComments(2, currentLesson.id, 0, from)
                .then(res => {
                    let result = comments.concat(res.data);
                    if (res.data.length < 10) setIsEnd(true);
                    setComments(result);
                });
        }
    }

    return (
        <div className="Comment_detailRow">
            <div className="Comment_contentHeading">
                <h4>&nbsp;</h4>
                <div className="Comment_shareBlock">
                    <span className="Comment_shareLabel">CHIA SẺ</span>
                    <div className="Comment_shareBtn Comment_shareBtnFb" title="Chia sẻ khóa học qua Facebook">
                        <allShareButton.FacebookShareButton
                            url={window.location.href}
                            title="Chia sẻ khóa học qua Facebook"
                            style={{ width: '100%' }}>
                            <FontAwesomeIcon icon={allIconBrand.faFacebook} className="fa-w-10 Comment_icon" />
                        </allShareButton.FacebookShareButton>
                    </div>
                    <div className="Comment_shareBtn Comment_shareBtnMail" title="Chia sẻ khóa học qua Mail">
                        <a href={`mailto:?subject=${currentLesson?.name}&body=${window.location.href}`}
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
            <CommentInput onCommentOk={onCommentOk} placeholder="Bạn có thắc mắc gì trong bài học này?" />
            {comments.map(item =>
                <CommentItem objectId={currentLesson.id} key={item.id} comment={item} />
            )}
            {!isEnd && <div className="Comment_loadMoreBlock" onClick={loadMore}>Xem thêm đánh giá</div>}
        </div>
    )
}

export { LessonComment };