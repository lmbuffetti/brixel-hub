import { handleActions } from 'redux-actions';
import {
  SET_USER,
} from '../actions/types/UserTypes';

export const defaultState = {
  loggedUser: {},
};

export default handleActions(
  {
    [SET_USER]: (state, action) => ({
      ...state,
      loggedUser: action.payload,
    }),
  },
  defaultState,
);
