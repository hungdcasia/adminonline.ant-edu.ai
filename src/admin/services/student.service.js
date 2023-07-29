
import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const studentService = {
    getList,
    create,
    remove
}

function getList(pagingOptions, filterOptions, sortOptions) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Students);
    let queryString = [pagingOptions, sortOptions].map(r => UrlHelpers.toQueryString(r))
    queryString.push(UrlHelpers.arrayObjectToQueryString(filterOptions, 'filters'));
    queryString = queryString.filter(r => r != '').join("&");
    apiUrl = UrlHelpers.combine(apiUrl, "?" + queryString)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function create(courseId, userId) {
    let model = {
        courseId,
        userId
    }
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Students);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function remove(courseId, userId) {
    let model = {
        courseId,
        userId
    }
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Students);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}