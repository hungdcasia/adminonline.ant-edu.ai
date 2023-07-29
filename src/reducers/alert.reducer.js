import { alertConstants } from '../constants';
import { types } from "react-alert";

export function alert(state = { type: 'none' }, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: types.SUCCESS,
        message: action.message,
      };
    case alertConstants.ERROR:
      return {
        type: types.ERROR,
        message: action.message
      };
    case alertConstants.INFO:
      return {
        type: types.INFO,
        message: action.message
      };
    case alertConstants.CLEAR:
      return {
        type: 'none',
      };
    default:
      return state
  }
}