import APICONFIGS from '../api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../helpers';

export const postService = {
    filter,
    detail,
    getCategories,
}

function getCategories() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.BlogCategories);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function filter(pagingOptions, filterOptions, sortOptions) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Posts);
    let queryString = [pagingOptions, sortOptions].map(r => UrlHelpers.toQueryString(r))
    queryString.push(UrlHelpers.arrayObjectToQueryString(filterOptions, 'filters'));

    queryString = queryString.filter(r => r != '').join("&");
    apiUrl = UrlHelpers.combine(apiUrl, "?" + queryString)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function detail(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Posts);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(`${apiUrl}`, requestOptions)
        .then(res => res);
}

