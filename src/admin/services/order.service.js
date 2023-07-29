import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const orderService = {
    getOrders, getDetail, updateStatus
}

function getOrders(pagingOptions, filterOptions, sortOptions) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Orders);
    let queryString = [pagingOptions, sortOptions].map(r => UrlHelpers.toQueryString(r))
    queryString.push(UrlHelpers.arrayObjectToQueryString(filterOptions, 'filters'));
    queryString = queryString.filter(r => r != '').join("&");
    apiUrl = UrlHelpers.combine(apiUrl, "?" + queryString)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function updateStatus(id, status) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify({ status })
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Orders);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`)
    apiUrl = UrlHelpers.combine(apiUrl, `status`)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getDetail(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Orders);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}