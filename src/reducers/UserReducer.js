import { handleActions } from 'redux-actions';
import {
  SET_AWARDS,
  SET_BRIXEL_POINT,
  SET_FAVORITES,
  SET_USER,
  SET_USER_PROPERTIES,
} from '../actions/types/UserTypes';

export const defaultState = {
  awards: [],
  brixelPoint: [],
  favorites: [],
  loggedUser: {},
  userProperties: [],
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
    [SET_FAVORITES]: (state, action) => ({
      ...state,
      favorites: action.payload,
    }),
    [SET_USER]: (state, action) => ({
      ...state,
      loggedUser: action.payload,
    }),
    [SET_USER_PROPERTIES]: (state, action) => ({
      ...state,
      userProperties: action.payload,
    }),
  },
  defaultState,
);
