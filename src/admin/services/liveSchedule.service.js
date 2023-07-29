import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const liveScheduleService = {
    getList,
    update,
    create,
    remove,
    cancel,
    getRegisteredList,
}

function getList(pagingOptions, filterOptions, sortOptions) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    let queryString = [pagingOptions, sortOptions].map(r => UrlHelpers.toQueryString(r))
    queryString.push(UrlHelpers.arrayObjectToQueryString(filterOptions, 'filters'));
    queryString = queryString.filter(r => r != '').join("&");
    apiUrl = UrlHelpers.combine(apiUrl, "?" + queryString)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getRegisteredList(pagingOptions, filterOptions, sortOptions) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    apiUrl = UrlHelpers.combine(apiUrl, "registers")
    let queryString = [pagingOptions, sortOptions].map(r => UrlHelpers.toQueryString(r))
    queryString.push(UrlHelpers.arrayObjectToQueryString(filterOptions, 'filters'));
    queryString = queryString.filter(r => r != '').join("&");
    apiUrl = UrlHelpers.combine(apiUrl, "?" + queryString)
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
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
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
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function cancel(id) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader(),
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}/cancel`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function remove(id) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader(),
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}
