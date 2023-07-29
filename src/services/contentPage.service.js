import APICONFIGS from '../api-configs.json';
import CONFIGS from '../configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader, store } from '../helpers';

export const contentPageService = {
    getPage,
    getContentPagesBrief
};

function getPage(pageId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetContentPages);
    apiUrl = UrlHelpers.combine(apiUrl, '' + pageId);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getContentPagesBrief() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetContentPagesBrief);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}