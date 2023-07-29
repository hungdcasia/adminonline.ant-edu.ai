import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const surveyService = {
    getAll,
    update,
    create,
    remove,
    getDetail,
    getDetailByCourse,
    getUserSurveys,
    removeUserSurvey,
}

function getDetail(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Surveys);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getDetailByCourse(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    apiUrl = UrlHelpers.combine(apiUrl, `surveys`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getAll() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Surveys);
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
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Surveys);
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
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Surveys);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function remove(id) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader(),
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Surveys);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getUserSurveys(pagingOptions, filterOptions, sortOptions) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.UserSurveys);
    let queryString = [pagingOptions, sortOptions].map(r => UrlHelpers.toQueryString(r))
    queryString.push(UrlHelpers.arrayObjectToQueryString(filterOptions, 'filters'));
    queryString = queryString.filter(r => r != '').join("&");
    apiUrl = UrlHelpers.combine(apiUrl, "?" + queryString)

    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function removeUserSurvey(id) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader(),
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.UserSurveys);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}
