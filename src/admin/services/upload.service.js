import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';


export const uploadService = {
    uploadImage, getImageUrl, uploadDocument, getDocumentUrl
}

function uploadImage(file) {
    var data = new FormData()
    data.append('file', file)

    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(),
        body: data
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL_UPLOAD, APICONFIGS.UploadImage);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function uploadDocument(file) {
    var data = new FormData()
    data.append('file', file)

    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(),
        body: data
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL_UPLOAD, APICONFIGS.UploadDocument);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getDocumentUrl(path) {
    if (path && isAbsolutePath(path)) {
        return path;
    }

    let url = UrlHelpers.combine(process.env.REACT_APP_BASEURL_UPLOAD, path);
    return url;
}

function getImageUrl(path) {
    if (path && isAbsolutePath(path)) {
        return path;
    }

    let url = UrlHelpers.combine(process.env.REACT_APP_BASEURL_UPLOAD, path);
    return url;
}

function isAbsolutePath(path) {
    return path.startsWith('http:') || path.startsWith('https:');
}