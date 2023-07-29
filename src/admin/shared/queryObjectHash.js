import queryString from 'query-string';
import { Base64 } from 'js-base64';

function fromQueryString(str, paramName) {
    let initParams = queryString.parse(str);
    let q = initParams[paramName] ?? null
    let isJsonObject = !!q && q.startsWith('{')
    if (!isJsonObject)
        q = q && Base64.decode(q);
    let initOptions = q && JSON.parse(q)
    return initOptions
}

function toBase64HashString(obj, paramName) {
    let q = JSON.stringify(obj);
    q = Base64.encode(q);
    return `?${paramName}=${encodeURIComponent(q)}`
}

function toJsonHashString(obj, paramName) {
    let q = JSON.stringify(obj);
    return `?${paramName}=${encodeURIComponent(q)}`
}

const queryObjectHash = { fromQueryString, toBase64HashString, toJsonHashString }
export default queryObjectHash