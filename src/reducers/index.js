import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { alert } from './alert.reducer';
import { loading } from './loading.reducer';
import { learningExcercises } from './excercise.reducer';
import { modal } from './modal.reducer';
import { myCourses } from './myCourses.reducer';
import { themeConst } from '../constants';


const initialState = {
  sidebarShow: 'responsive',
}

const adminState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const defaultTheme = themeConst.dark;
const getSavedTheme = (theme) => {
  switch (theme) {
    case themeConst.dark:
      return themeConst.dark;
    case themeConst.light:
      return themeConst.light;
    default:
      return defaultTheme;
  }
};

const themeInitState = {
  name: getSavedTheme(localStorage.getItem('theme'))
}

const themeState = (state = themeInitState, { type, ...rest }) => {
  switch (type) {
    case 'SetTheme':
      return { ...state, ...rest }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  adminState,
  authentication,
  alert,
  learningExcercises,
  loading,
  modal,
  myCourses,
  themeState
});

export default rootReducer;