import { handleActions } from 'redux-actions';
import {
  SET_AWARDS,
  SET_BRIXEL_POINT,
  SET_USER,
} from '../actions/types/UserTypes';

export const defaultState = {
  awards: {},
  brixelPoint: {},
  loggedUser: {},
};

export default handleActions(
  {
    [SET_AWARDS]: (state, action) => ({
      ...state,
      awards: action.payload,
    }),
    [SET_BRIXEL_POINT]: (state, action) => ({
      ...state,
      brixelPoint: action.payload,
    }),
    [SET_USER]: (state, action) => ({
      ...state,
      loggedUser: action.payload,
    }),
  },
  defaultState,
);
