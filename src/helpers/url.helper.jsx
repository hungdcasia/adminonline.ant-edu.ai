import { generatePath } from "react-router";

const learningPath = "/learning/:course/:courseId/:lesson?/:lessonId?/:tab?";
const courseDetailPath = "/course/:name/:id";
const courseCheckout = "/checkout/:name/:id";

export const UrlHelpers = {
    combine,
    combineFormatting,
    createLearningUrl,
    createCourseDetailUrl,
    toQueryString,
    toQueryArray,
    arrayObjectToQueryString,
    learningPath: learningPath,
    courseDetailPath: courseDetailPath,
    courseCheckout: courseCheckout,
    isAbsoluteUrl
}


function combine(url1, url2) {
    if (url2.startsWith('http'))
        return url2;

    if (url1.length > 0 && url1.endsWith('/'))
        url1 = url1.substr(0, url1.length - 1);

    if (url2.length > 0 && url2.startsWith('/'))
        url2 = url2.substr(1, url2.length - 1);

    return url1 + '/' + url2;
}

function combineFormatting(url, ...args){
    url = url.replace(/{[0-9]+}/g, (x) => {
        let i = x.replace("{", "").replace("}", "")
        return args[i]
    })
    return url;
}

function createLearningUrl(courseSlug, courseId, lessonSlug, lessonId, tab) {
    let path = generatePath(learningPath, {
        course: courseSlug,
        courseId: courseId,
        lesson: lessonSlug,
        lessonId: lessonId,
        tab: tab
    });

    return path;
}

function createCourseDetailUrl(courseSlug, courseId) {
    let path = generatePath(courseDetailPath, {
        name: courseSlug,
        id: courseId,
    });

    return path;
}

function toQueryString(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function toQueryArray(parameterName, items) {
    var str = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        str.push(encodeURIComponent(parameterName) + '=' + encodeURIComponent(item))
    }
    return str.join("&");
}


function arrayObjectToQueryString(arr, fieldName) {
    var str = [];
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        for (var p in element)
            if (element.hasOwnProperty(p)) {
                str.push(`${fieldName}[${i}].` + encodeURIComponent(p) + "=" + encodeURIComponent(element[p]));
            }
    }
    return str.join("&");
}

function isAbsoluteUrl(url){
    return url != null && url.startsWith('http');
}