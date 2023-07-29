import { modalConstants } from '../constants';
import { types } from "react-alert";

export function modal(state = { options: null }, action) {
  switch (action.type) {
    case modalConstants.SHOW:
      return {
        show: true,
        options: action.options
      };
    case modalConstants.CLEAR:
      return {
        show: false,
        options: null
      };
    default:
      return state
  }
}