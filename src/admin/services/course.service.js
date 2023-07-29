import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const courseService = {
    filter,
    getList,
    update,
    create,
    dupplicate,
    remove,
    getDetail,
    getCertificate,
    updateCertificate,
}

function filter(pagingOptions, filterOptions, sortOptions) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    let queryString = [pagingOptions, sortOptions].map(r => UrlHelpers.toQueryString(r))
    queryString.push(UrlHelpers.arrayObjectToQueryString(filterOptions, 'filters'));
    queryString = queryString.filter(r => r != '').join("&");
    apiUrl = UrlHelpers.combine(apiUrl, "?" + queryString)

    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getList() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, "all")
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getDetail(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`)
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
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}


function dupplicate(courseId) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify({ id: courseId })
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, 'dupplicate');
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
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function remove(id) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(`${apiUrl}`, requestOptions)
        .then(res => res);


}

function getCertificate(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`)
    apiUrl = UrlHelpers.combine(apiUrl, `certificates`)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function updateCertificate(id, model) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`)
    apiUrl = UrlHelpers.combine(apiUrl, `certificates`)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}
