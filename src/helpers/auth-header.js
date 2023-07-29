import { store } from './'

export const headerHelper = { authHeader, jsonHeader }

export function authHeader(additionalHeaders = null) {
    let user = store.getState().authentication.userToken
    if (additionalHeaders == null) {
        additionalHeaders = {};
    }
    if (user && user.token) {
        additionalHeaders['Authorization'] = 'Bearer ' + user.token;
    }

    return additionalHeaders;
}

export function jsonHeader(additionalHeaders = null) {
    if (additionalHeaders == null) {
        additionalHeaders = {};
    }
    additionalHeaders['Content-Type'] = 'application/json';

    return additionalHeaders;
}