import { alertConstants } from '../constants';
import { store } from "../helpers";

export const alertActions = {
    success,
    error,
    info,
    clear,
    successUpdate,
    failUpdate,
    successDelete,
};

function success(message) {
    return store.dispatch({ type: alertConstants.SUCCESS, message });
}

function error(message) {
    return store.dispatch({ type: alertConstants.ERROR, message });
}

function info(message) {
    return store.dispatch({ type: alertConstants.INFO, message });
}

function clear() {
    return store.dispatch({ type: alertConstants.CLEAR });
}


function successUpdate() {
    return success('Cập nhật thành công');
}

function successDelete() {
    return success('Xóa bản ghi thành công');
}

function failUpdate() {
    return error('Cập nhật không thành công');
}