
import APICONFIGS from '../api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader, store, customFetchNoLoading } from '../helpers';

export const searchService = {
    searchUser,
};

function searchUser(keyword) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Search);
    apiUrl = UrlHelpers.combine(apiUrl, `users?q=${keyword}`);
    return customFetchNoLoading(apiUrl, requestOptions)
        .then(res => res);
}
