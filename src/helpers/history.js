import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
window.appHistory = history
history.login = () => {
    let returnPath = window.location.pathname;
    history.push('/login?r=' + encodeURI(returnPath));
}

history.register = () => {
    history.push('/register?r=' + encodeURI(window.location.pathname));
}