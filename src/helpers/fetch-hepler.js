import { alertActions } from '../actions';
import { store } from "./store";
import { loadingConstants, userConstants } from "../constants";

function customFetch(url, options = null) {
    if (options != null && !options['credentials']) {
        options['credentials'] = 'include';
    }
    store.dispatch({ type: loadingConstants.INCREASE });
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                if (response.status == 500 || response.status == 404) {
                    alertActions.error("Internal server error.");
                } else if (response.status == 401) {
                    store.dispatch({ type: userConstants.LOGOUT });
                } else if (response.status == 400) {
                    let resObj = response.json();
                    alertActions.error(resObj.title);
                } else {
                    throw new Error(response.status);
                }

                store.dispatch({ type: loadingConstants.DECREASE });

                throw new Error('');
            } else {
                return response.json();
            }
        })
        .then(responseObj => {
            if (!responseObj.isSuccess && responseObj.errors != null && responseObj.errors.length > 0) {
                let error = responseObj.errors[0];
                alertActions.error(error.message);
            }

            store.dispatch({ type: loadingConstants.DECREASE });
            return responseObj;
        })
        .catch(error => {
            console.error(error, 'error');
            if (error.message !== '') {
                store.dispatch({ type: loadingConstants.DECREASE });
                alertActions.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại!')
            }

            return Promise.reject('');
        });
}

function customFetchNoLoading(url, options = null) {
    if (options != null && !options['credentials']) {
        options['credentials'] = 'include';
    }
    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                if (response.status == 401) {
                    store.dispatch({ type: userConstants.LOGOUT });
                } else {
                    throw new Error(response.status);
                }
            } else {
                return response.json();
            }
        })
        .then(responseObj => {
            return responseObj;
        })
        .catch(error => {
            console.error(error, 'error');
            return Promise.reject('');
        });
}

export { customFetch, customFetchNoLoading }