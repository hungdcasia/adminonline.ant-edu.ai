import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const blogCategoryService = {
    getCategories,
    updateCategory,
    createCategory,
    deleteCategory
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

function createCategory(model) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.BlogCategories);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function updateCategory(model) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.BlogCategories);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function deleteCategory(id) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.BlogCategories);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(`${apiUrl}`, requestOptions)
        .then(res => res);
}
