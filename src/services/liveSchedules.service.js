import APICONFIGS from '../api-configs.json';
import CONFIGS from '../configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../helpers';

export const liveSchedulesService = {
    getList,
    getDetail,
    register,
    cancelRegister,
    myList
};

function getList() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getDetail(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    apiUrl = UrlHelpers.combine(apiUrl, '' + id);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function register(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    apiUrl = UrlHelpers.combine(apiUrl, id + '/register');
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function cancelRegister(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    apiUrl = UrlHelpers.combine(apiUrl, id + '/cancel-register');
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function myList() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.LiveSchedules);
    apiUrl = UrlHelpers.combine(apiUrl, '/my');
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}
