import APICONFIGS from '../api-configs.json';
import CONFIGS from '../configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../helpers';

export const questionsService = {
    getQuestions,
    questionSubmit,
    getQuestionsByCourse,
    getUserQuestionsByCourse,
    getUserQuestionsByLesson
};

function getQuestions(lessonId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetQuestions);
    return customFetch(apiUrl.format(lessonId), requestOptions)
        .then(res => res);
}

function getQuestionsByCourse(courseId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetQuestionsByCourse);
    return customFetch(apiUrl.format(courseId), requestOptions)
        .then(res => res);
}

function getUserQuestionsByCourse(courseId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetUserQuestionsByCourse);
    return customFetch(apiUrl.format(courseId), requestOptions)
        .then(res => res);
}

function getUserQuestionsByLesson(lessonId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetUserQuestionsByLesson);
    return customFetch(apiUrl.format(lessonId), requestOptions)
        .then(res => res);
}

function questionSubmit(questionId, answers) {
    let model = {
        answers: answers
    };
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.QuestionSubmit);
    return customFetch(apiUrl.format(questionId), requestOptions)
        .then(res => res);
}