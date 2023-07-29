import APICONFIGS from '../api-configs.json';
import CONFIGS from '../configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../helpers';

export const bannerService = {
    getAll
};

function getAll(lessonId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Banners);
    return customFetch(apiUrl.format(lessonId), requestOptions)
        .then(res => res);
}