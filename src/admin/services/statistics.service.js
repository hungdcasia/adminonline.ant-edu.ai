import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const statisticService = {
    getSystemStas,
    topCourseByRegistered,
    topCourseByRevenue
}

function getSystemStas() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.SystemStats);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function topCourseByRegistered() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.TopCourseByRegistered);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function topCourseByRevenue() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.TopCourseByRevenue);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}
