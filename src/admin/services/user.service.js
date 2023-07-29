import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const userService = {
    getList,
    getListAdmin,
    getDetail,
    update,
    create,
    remove,
    lockUser,
    addToRole,
    removeFromRole,
    setPassword,
    findByUserNames,
    findByUserNamesPOST
}

function getList(pagingOptions, filterOptions, sortOptions) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    let queryString = [pagingOptions, sortOptions].map(r => UrlHelpers.toQueryString(r))
    queryString.push(UrlHelpers.arrayObjectToQueryString(filterOptions, 'filters'));
    queryString = queryString.filter(r => r != '').join("&");
    apiUrl = UrlHelpers.combine(apiUrl, "?" + queryString)

    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function findByUserNames(userNames) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    apiUrl = UrlHelpers.combine(apiUrl, `find-by-username`)
    apiUrl = UrlHelpers.combine(apiUrl, `?${UrlHelpers.toQueryArray('userName', userNames)}`)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function findByUserNamesPOST(userNames) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        body: JSON.stringify(userNames),
        headers: authHeader(jsonHeader())
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    apiUrl = UrlHelpers.combine(apiUrl, `find-by-username`)
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getListAdmin() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Administrators);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getDetail(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    apiUrl = UrlHelpers.combine(apiUrl, '' + id);
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
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
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
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function setPassword(model) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    apiUrl = UrlHelpers.combine(apiUrl, 'set-password');
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function remove(userId) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader(),
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    apiUrl = UrlHelpers.combine(apiUrl, `${userId}`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function lockUser(userId, activeState) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify({
            active: activeState
        })
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    apiUrl = UrlHelpers.combine(apiUrl, `${userId}/${activeState ? 'active' : 'deactive'}`);
    return customFetch(`${apiUrl}`, requestOptions)
        .then(res => res);
}

function addToRole(userId, role) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    apiUrl = UrlHelpers.combine(apiUrl, `${userId}/roles/${role}`);
    return customFetch(`${apiUrl}`, requestOptions)
        .then(res => res);
}

function removeFromRole(userId, role) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Users);
    apiUrl = UrlHelpers.combine(apiUrl, `${userId}/roles/${role}`);
    return customFetch(`${apiUrl}`, requestOptions)
        .then(res => res);
}