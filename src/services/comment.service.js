import APICONFIGS from '../api-configs.json';
import CONFIGS from '../configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader, store } from '../helpers';

export const commentService = {
    getComments,
    comment,
    likeComment,
    unlikeComment
};

function listUserLiked(str) {
    if (str == null || str == '')
        return [];

    return JSON.parse(str);
}

function preProcessComment(comment) {
    comment.likes = listUserLiked(comment.likedUsers);
}

function getComments(type, objectId, replyTo, from) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetComments);
    apiUrl = `${apiUrl}?t=${type}&o=${objectId}&r=${replyTo}&f=${from}`;
    return customFetch(apiUrl, requestOptions)
        .then(res => {
            res.data.forEach(comment => {
                preProcessComment(comment);
            });
            return res;
        });
}

function comment(type, objectId, replyTo, content) {
    let model = { type, objectId, replyTo, content };

    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Comment);
    return customFetch(apiUrl, requestOptions)
        .then(res => {
            let comment = res.data;
            preProcessComment(comment);
            let { userInfomation } = store.getState().authentication;
            comment.user = { id: userInfomation.id, displayName: userInfomation.displayName, avatar: userInfomation.avatar };
            return res;
        });
}

function likeComment(id) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LikeComment);
    return customFetch(apiUrl.format(id), requestOptions)
        .then(res => {
            let comment = res.data;
            preProcessComment(comment);
            return res;
        });
}

function unlikeComment(id) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.UnLikeComment);
    return customFetch(apiUrl.format(id), requestOptions)
        .then(res => {
            let comment = res.data;
            preProcessComment(comment);
            return res;
        });
}
