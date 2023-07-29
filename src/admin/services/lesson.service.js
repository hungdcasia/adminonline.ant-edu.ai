import APICONFIGS from '../admin-api-configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../../helpers';

export const lessonService = {
    getAllByCourse,
    update,
    create,
    remove,
    sort,
    createQuiz,
    updateQuiz,
    removeQuiz,
    getQuizzesByLesson,
    // getDetail
}

function getAllByCourse(courseId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetAllLessonsByCourse);
    apiUrl = UrlHelpers.combine(apiUrl, `${courseId}`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

// function getDetail(id) {
//     let requestOptions = {
//         method: 'GET',
//         cache: 'no-cache',
//         headers: authHeader()
//     };
//     let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
//     apiUrl = UrlHelpers.combine(apiUrl, `${id}`)
//     return customFetch(apiUrl, requestOptions)
//         .then(res => res);
// }

function create(model) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Lessons);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function update(model) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Lessons);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function sort(model) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Lessons);
    apiUrl = UrlHelpers.combine(apiUrl, 'sort');
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function remove(id) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Lessons);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(`${apiUrl}`, requestOptions)
        .then(res => res);
}

function createQuiz(model) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Quizzes);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function updateQuiz(model) {
    let requestOptions = {
        method: 'PUT',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Quizzes);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function removeQuiz(id) {
    let requestOptions = {
        method: 'DELETE',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Quizzes);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(`${apiUrl}`, requestOptions)
        .then(res => res);
}

function getQuizzesByLesson(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetQuizzesByLesson);
    apiUrl = UrlHelpers.combineFormatting(apiUrl, `${id}`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}
