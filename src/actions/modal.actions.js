import { modalConstants } from '../constants';
import { store } from "../helpers";

export const modalActions = {
    show,
    clear
};

function show(options) {
    return store.dispatch({ type: modalConstants.SHOW, options });
}

function clear() {
    return store.dispatch({ type: modalConstants.CLEAR });
}