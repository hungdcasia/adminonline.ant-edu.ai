import { userConstants } from '../constants';

// let user = JSON.parse(localStorage.getItem('userToken'));
const initialState = () => { return { loggedIn: false, userToken: null, userInfomation: {}, needConfirmEmail: false }; }

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return state;
    case userConstants.LOGIN_SUCCESS:
      state['loggedIn'] = true;
      state['userToken'] = action.userToken;
      return {
        loggedIn: state.loggedIn,
        userToken: state.userToken,
        needConfirmEmail: false,
        userInfomation: {}
      };
    case userConstants.INFOMATION_SUCCESS:
      state['userInfomation'] = action.user;
      state['needConfirmEmail'] = !action.user.emailConfirmed;
      return {
        loggedIn: state.loggedIn,
        userToken: state.userToken,
        userInfomation: state.userInfomation,
        needConfirmEmail: state.needConfirmEmail
      };
    case userConstants.LOGIN_FAILURE:
      return initialState();
    case userConstants.LOGOUT:
      return initialState();
    default:
      return state
  }
}