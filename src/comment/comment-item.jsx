import { useState, useEffect, useRef } from "react";
import { Avatar } from "../shared";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allIcon from '@fortawesome/free-solid-svg-icons';
import { commentService } from "../services";
import Moment from 'react-moment';
import { store } from "../helpers";
import { CommentInput } from "./index";

const checkLiked = (comment) => {
    var userId = store.getState().authentication.userInfomation?.id;
    if (userId == null || comment.likes.length == 0) return false;
    return comment.likes.includes(userId);
}

const likeComment = (comment, success) => {
    let isLiked = checkLiked(comment);
    var task;
    if (isLiked) {
        task = commentService.unlikeComment(comment.id);
    } else {
        task = commentService.likeComment(comment.id);
    }
    task.then(res => {
        if (res.isSuccess) {
            let newComment = res.data;
            comment.likedUsers = newComment.likedUsers;
            comment.likes = newComment.likes;
            comment.likeCount = newComment.likes.length;
        }
        success?.call(res.isSuccess);
    })
};

const newReply = (comment, content, success) => {
    commentService.comment(comment.type, comment.objectId, comment.id, content)
        .then(res => {
            var newComment = res.data;
            success(newComment);
        });
}

const CommentItem = (props) => {
    const { comment, type, objectId } = props;
    let [showReply, setShowReply] = useState(false);
    let [replies, setReplies] = useState([]);
    let [newReplies, setNewReplies] = useState([]);
    let [isEnd, setIsEnd] = useState(false);
    let [temp, setTemp] = useState({});
    let [showReplyInput, setShowReplyInput] = useState(false);
    let input = useRef();

    const toggleReplies = () => {
        if (replies.length == 0) {
            loadReplies();
        }

        setShowReply(!showReply);
    }

    const loadReplies = () => {
        if (!isEnd && comment.replyCount > 0) {
            let from = replies.last()?.id ?? 0;
            commentService.getComments(comment.type, objectId, comment.id, from)
                .then(res => {
                    let result = replies.concat(res.data);
                    if (result.length == comment.replyCount) setIsEnd(true);
                    setReplies(result);
                });
        }
    }

    const likeClicked = () => {
        likeComment(comment, (success) => {
            setTemp({});
        });
    };

    const replyClicked = () => {
        if (showReplyInput) {
            input.current.focus();
        }
        setShowReplyInput(true);
    }

    const onCommentOk = (content) => {
        newReply(comment, content, (newComment) => {
            var news = newReplies.concat([newComment]);
            setNewReplies(news);
        });
        setShowReplyInput(false);
    }

    return (
        <>
            <div className="Comment_detailComment">
                <div className="Comment_avatarWrap">
                    <div className="Comment_avatar"><Avatar url={comment.user.avatar} className='Comment_avatar' /></div>
                </div>
                <div className="Comment_commentBody">
                    <div className="Comment_commentContent">
                        <h5 className="Comment_commentAuthor">{comment.user.displayName}</h5>
                        <div className="Comment_commentText"><span>{comment.content}</span></div>
                        {comment.likeCount > 0 &&
                            <div className="Comment_likesCountWrapper">
                                <FontAwesomeIcon icon={allIcon.faThumbsUp} className='fa-w-16 Comment_likeIcon' />
                                <span className="Comment_likesCount">{comment.likeCount}</span>
                            </div>
                        }
                    </div>

                    <CommentAction comment={comment} onLikeClicked={likeClicked} onReplyClicked={replyClicked} />
                    {/* {showReplyInput &&
                        <CommentInput onCommentOk={onCommentOk} onCommentCancel={() => setShowReplyInput(false)} placeholder="Bình luận công khai..." />
                    } */}
                    {comment.replyCount > 0 &&
                        <div className="Comment_viewRepliesMore" onClick={toggleReplies}>
                            <span>
                                <span className="Comment_showHideComment">{showReply ? 'Ẩn câu trả lời' : `Xem ${comment.replyCount} câu trả lời`}</span>
                                <FontAwesomeIcon icon={showReply ? allIcon.faAngleUp : allIcon.faAngleDown} className="fa-w-10 Comment_icon" />
                            </span>
                        </div>
                    }
                </div>
            </div>
            <div className="Comment_replyWrap">
                {showReply && replies.map(commentReplie => {
                    return (
                        <ReplyItem comment={commentReplie} key={commentReplie.id} onReplyClicked={replyClicked} />
                    );
                })}

                {newReplies.map(commentReplie => {
                    return (
                        <ReplyItem comment={commentReplie} key={commentReplie.id} onReplyClicked={replyClicked} />
                    );
                })}
                {showReplyInput &&
                    <div className="Comment_detailComment">
                        <div className="Comment_avatarWrap">
                        </div>
                        <div className="Comment_commentBody">
                            <CommentInput onCommentOk={onCommentOk} innerRef={input}
                                onCommentCancel={() => setShowReplyInput(false)}
                                placeholder="Bình luận công khai..."
                                autoFocus />
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

const ReplyItem = (props) => {
    const { comment, onReplyClicked } = props;
    let [temp, setTemp] = useState({});
    const likeClicked = () => {
        likeComment(comment, (success) => {
            setTemp({});
        });
    };

    const replyClicked = () => {
        // setShowReply(true);
    }
    return (
        <div className="Comment_detailComment Comment_replyCommentWrap">
            <div className="Comment_avatarWrap"><Avatar url={comment.user.avatar} className='Comment_avatar' /> </div>
            <div className="Comment_commentBody">
                <div className="Comment_commentContent">
                    <h5 className="Comment_commentAuthor">{comment.user.displayName}</h5>
                    <div className="Comment_commentText">
                        <span>
                            {comment.content}
                        </span>
                    </div>
                    {comment.likeCount > 0 &&
                        <div className="Comment_likesCountWrapper">
                            <FontAwesomeIcon icon={allIcon.faThumbsUp} className='fa-w-16 Comment_likeIcon' />
                            <span className="Comment_likesCount">{comment.likeCount}</span>
                        </div>
                    }
                </div>
                <CommentAction comment={comment} onLikeClicked={likeClicked} onReplyClicked={onReplyClicked} />
            </div>
        </div>
    );
}

const CommentAction = (props) => {
    const { comment, onLikeClicked, onReplyClicked } = props;
    let isLiked = checkLiked(comment);
    return (
        <div className="Comment_commentTime noselect">
            <p className="Comment_createdAt">
                <span className="Comment_iconWrapper">
                    <span className={`Comment_likeComment ${isLiked && 'Comment_liked'}`} onClick={onLikeClicked}>{'Thích'}</span>
                </span>
                ·<span className="Comment_replyComment" onClick={onReplyClicked}>Trả lời</span>
                · <Moment fromNow locale="vi">{comment.createdDateTime}</Moment>
            </p>
        </div>
    );
}

export { CommentItem }