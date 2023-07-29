import { userConstants, myCoursesConstants } from '../constants';
import { userService } from '../services';
import { history, UrlHelpers, store, authHeader } from '../helpers';
import { HubConnectionBuilder } from "@microsoft/signalr";

export const userActions = {
    login,
    loginGoogle,
    loginFacebook,
    getInfomation,
    checkLogin,
    logout,
    getMyCourses,
    clearMyCourses,
    checkSSOSupport,
    // register,
    // getAll,
    // delete: _delete
};

function login(username, password) {
    return dispatch => {
        dispatch(request());

        userService.login(username, password)
            .then(
                res => {
                    if (res.isSuccess) {
                        let data = res.data;
                        localStorage.setItem('userToken', JSON.stringify(data));
                        dispatch(success(data));
                        checkSSOSupport()(dispatch);
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.LOGIN_REQUEST } }
    function success(userToken) { return { type: userConstants.LOGIN_SUCCESS, userToken } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function loginGoogle(idToken) {
    return dispatch => {
        dispatch(request());

        userService.loginGoogle(idToken)
            .then(
                res => {
                    if (res.isSuccess) {
                        let data = res.data;
                        localStorage.setItem('userToken', JSON.stringify(data));
                        dispatch(success(data));
                        checkSSOSupport()(dispatch);
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.LOGIN_REQUEST } }
    function success(userToken) { return { type: userConstants.LOGIN_SUCCESS, userToken } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function loginFacebook(idToken) {
    return dispatch => {
        dispatch(request());

        userService.loginFacebook(idToken)
            .then(
                res => {
                    if (res.isSuccess) {
                        let data = res.data;
                        localStorage.setItem('userToken', JSON.stringify(data));
                        dispatch(success(data));
                        // history.push('/');
                        getInfomation()(dispatch);
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.LOGIN_REQUEST } }
    function success(userToken) { return { type: userConstants.LOGIN_SUCCESS, userToken } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function getInfomation() {
    return dispatch => {
        userService.getInfomarion()
            .then(
                userInfo => {
                    dispatch(success(userInfo.data));
                    window.gtag('config', process.env.REACT_APP_GAID, {
                        'user_id': userInfo.data.id
                    });
                },
                error => {
                    if (error.message == 401) {
                        localStorage.removeItem('userToken');
                        dispatch(logout());
                        clearMyCourses();
                    }
                }
            );
    };

    function success(user) { return { type: userConstants.INFOMATION_SUCCESS, user } }
    function logout() { return { type: userConstants.LOGOUT } }
}

function checkLogin() {
    return dispatch => {
        let userToken = JSON.parse(localStorage.getItem('userToken'));
        if (userToken != null) {
            dispatch(success(userToken));
            getInfomation()(dispatch);
            checkSSOSupport()(dispatch);
        } else {
            
        }
        
    };

    function success(userToken) { return { type: userConstants.LOGIN_SUCCESS, userToken } }
}

//Checklogin from cookie through getInfomation()
function checkSSOSupport(){
    return dispatch => {
        userService.checkSSOSupport()
            .then(
                res => {
                    if(res?.data){
                        dispatch(success(res?.data));
                        getMyCourses();
                    } else {
                        localStorage.removeItem('userToken');
                        dispatch(logout());
                        clearMyCourses();
                    }
                    
                },
                error => {
                    if (error.message == 401) {
                        localStorage.removeItem('userToken');
                        dispatch(logout());
                        clearMyCourses();
                    }
                }
            );
    };

    function successLogin() { return { type: userConstants.LOGIN_SUCCESS } }
    function success(user) { return { type: userConstants.INFOMATION_SUCCESS, user } }
    function logout() { return { type: userConstants.LOGOUT } }
}

function getMyCourses() {
    const { dispatch } = store;
    userService.getMyCourses()
        .then(
            res => {
                dispatch(success(res.data));
                // subcribeMyCourseChannel();
            }
        );

    function success(courses) { return { type: myCoursesConstants.SUCCESS, courses } }
}

function subcribeMyCourseChannel() {
    if (!store.myCoursesChannel) {
        let userToken = store.getState().authentication.userToken;
        var url = UrlHelpers.combine(process.env.REACT_APP_BASEURL, '/hubs/my-courses');
        let connection = new HubConnectionBuilder()
            .withUrl(url, { accessTokenFactory: () => userToken.token })
            .withAutomaticReconnect()
            .build();
        store.myCoursesChannel = connection;
        connection.start();
        connection.on('new', function (message) {
            const { dispatch } = store;
            var course = JSON.parse(message);
            dispatch(newCourse(course))
            // getMyCourses()(dispatch);
        });
        connection.on('update', function (message) {
            const { dispatch } = store;
            var course = JSON.parse(message);
            dispatch(updateCourse(course))
            // getMyCourses()(dispatch);
        });
    }

    function newCourse(course) { return { type: myCoursesConstants.NEW, course } }
    function updateCourse(course) { return { type: myCoursesConstants.UPDATE, course } }
}

function clearMyCourses() {
    const { dispatch } = store;
    dispatch({ type: myCoursesConstants.CLEAR });
    if (store.myCoursesChannel) {
        store.myCoursesChannel.stop();
        store.myCoursesChannel = null;
    }
}

function logout() {
    
    localStorage.removeItem('userToken');
    function logout() { return { type: userConstants.LOGOUT } }
    function clearUserInfomation() { return { type: userConstants.INFOMATION_CLEAR } }
    
    userService.logout().then(res => {
        store.dispatch(logout());
        clearMyCourses();
        history.login();
    })
}

// function register(user) {
//     return dispatch => {
//         dispatch(request(user));

//         userService.register(user)
//             .then(
//                 user => { 
//                     dispatch(success());
//                     history.push('/login');
//                     dispatch(alertActions.success('Registration successful'));
//                 },
//                 error => {
//                     dispatch(failure(error.toString()));
//                     dispatch(alertActions.error(error.toString()));
//                 }
//             );
//     };

//     function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
//     function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
//     function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
// }

// function getAll() {
//     return dispatch => {
//         dispatch(request());

//         userService.getAll()
//             .then(
//                 users => dispatch(success(users)),
//                 error => dispatch(failure(error.toString()))
//             );
//     };

//     function request() { return { type: userConstants.GETALL_REQUEST } }
//     function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
//     function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
// }

// // prefixed function name with underscore because delete is a reserved word in javascript
// function _delete(id) {
//     return dispatch => {
//         dispatch(request(id));

//         userService.delete(id)
//             .then(
//                 user => dispatch(success(id)),
//                 error => dispatch(failure(id, error.toString()))
//             );
//     };

//     function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
//     function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
//     function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
// }