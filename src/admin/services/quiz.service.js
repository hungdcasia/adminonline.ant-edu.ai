import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const quizService = {
    getListByLesson,
    update,
    create,
    remove
}

function getListByLesson(lessonId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Questions);
    apiUrl = UrlHelpers.combine(apiUrl, `lesson/${lessonId}`)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function create(model) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Questions);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function update(model) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Questions);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function remove(id) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Questions);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(`${apiUrl}`, requestOptions)
        .then(res => res);
}
