import APICONFIGS from '../api-configs.json';
import CONFIGS from '../configs.json';
import { UrlHelpers, customFetch, authHeader, jsonHeader } from '../helpers';

export const courseService = {
    getCategories,
    getCoursesByCategory,
    getCoursesFeatured,
    getCoursesNewest,
    getCoursesHot,
    getCourseDetail,
    getRelatedCourses,
    getCourseLessons,
    completeLesson,
    registerCourse,
    courseFeedback,
    getCourseFeedback,
    courseCheckout,
    getCourseCheckout,
    getSurveyByCourseId,
    submitSurvey,
    getCertificate,
    assessmentCertificateAttempt,
    getAssessmentAttempt,
    submitAssessmentAttempt,
    getUserCertificateByCourseId,
    getUserCertificates,
    getTeachers,
    getCoursesByTeacher,
    getCoursesByKeyword,
    submitQuiz,
    getQuizzesByLesson,
    getQuizById,
};

function getCategories() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetCategories);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getCoursesByCategory(categoryId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetCoursesByCategory);
    return customFetch(apiUrl.format(categoryId), requestOptions)
        .then(res => res);
    // .then(res => coursesData);
}

function getCoursesByTeacher(name) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, "teacher/" + name);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getCoursesByKeyword(keyword) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, "search/" + keyword);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getCoursesNewest() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetCoursesNewest);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
    // .then(res => coursesFeaturedData);
}

function getCoursesFeatured() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetCoursesFeatured);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
    // .then(res => coursesFeaturedData);
}

function getCoursesHot() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetCoursesHot);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
    // .then(res => coursesFeaturedData);
}

function getRelatedCourses(courseId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };

    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, courseId + '/related');
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getCourseDetail(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };

    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetCourseDetail);
    return customFetch(apiUrl.format(id), requestOptions)
        .then(res => res);
}

function getCourseLessons(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };

    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetCourseLessons);
    // let apiUrl = UrlHelpers.combine('/', APICONFIGS.GetCourseDetail);
    return customFetch(apiUrl.format(id), requestOptions)
        .then(res => res);
    // .then(res => courseDetail);
}

function completeLesson(lessonId, progress) {
    let model = {
        lessonId: lessonId,
        progress: progress
    };
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };

    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.CompleteLesson);
    // let apiUrl = UrlHelpers.combine('/', APICONFIGS.GetCourseDetail);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
    // .then(res => courseDetail);
}


function registerCourse(courseId) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader()
    };
    // let apiUrl = UrlHelpers.combine('/', APICONFIGS.GetLessonExcercisesDetail);
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.RegisterCourse);
    return customFetch(apiUrl.format(courseId), requestOptions)
        .then(res => res);
    // .then(res => coursesExcercisesDetail);
}

function getCourseFeedback(courseId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };

    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.MyCourseFeedback);
    return customFetch(apiUrl.format(courseId), requestOptions)
        .then(res => res);
}

function courseFeedback(courseId, star, comment) {
    let model = {
        star, comment
    }
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };

    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.MyCourseFeedback);
    return customFetch(apiUrl.format(courseId), requestOptions)
        .then(res => res);
}

function courseCheckout(courseId, contactName, contactEmail, contactPhone, captchaToken) {
    let model = {
        courseId, contactName, contactEmail, contactPhone, captchaToken
    }
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };

    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Checkout);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getCourseCheckout(courseId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader(),
    };

    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Checkout);
    apiUrl = UrlHelpers.combine(apiUrl, '' + courseId);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getSurveyByCourseId(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    apiUrl = UrlHelpers.combine(apiUrl, `surveys`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function submitSurvey(model) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Surveys);
    apiUrl = UrlHelpers.combine(apiUrl, `submit`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getCertificate(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    apiUrl = UrlHelpers.combine(apiUrl, `certificates`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function assessmentCertificateAttempt(courseId) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Courses);
    apiUrl = UrlHelpers.combine(apiUrl, `${courseId}`);
    apiUrl = UrlHelpers.combine(apiUrl, `certificates/attempts`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getAssessmentAttempt(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, 'api/assessment-attempts');
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function submitAssessmentAttempt(id, model) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, 'api/assessment-attempts');
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    apiUrl = UrlHelpers.combine(apiUrl, `submit`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getUserCertificateByCourseId(id) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, 'api/user/courses');
    apiUrl = UrlHelpers.combine(apiUrl, `${id}`);
    apiUrl = UrlHelpers.combine(apiUrl, `certificates`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getUserCertificates() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, 'api/user/certificates');
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function getTeachers() {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, 'api/teachers');
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}

function submitQuiz(model) {
    let requestOptions = {
        method: 'POST',
        cache: 'no-cache',
        headers: authHeader(jsonHeader()),
        body: JSON.stringify(model)
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.Quizzes);
    apiUrl = UrlHelpers.combine(apiUrl, `submit`);
    return customFetch(apiUrl, requestOptions)
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

function getQuizById(quizId) {
    let requestOptions = {
        method: 'GET',
        cache: 'no-cache',
        headers: authHeader()
    };
    let apiUrl = UrlHelpers.combine(process.env.REACT_APP_BASEURL, APICONFIGS.GetQuizById);
    apiUrl = UrlHelpers.combineFormatting(apiUrl, `${quizId}`);
    return customFetch(apiUrl, requestOptions)
        .then(res => res);
}