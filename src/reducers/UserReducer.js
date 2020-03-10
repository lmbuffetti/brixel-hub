import { handleActions } from 'redux-actions';
import {
  SET_USER_TYPES,
  SET_AWARDS,
  SET_BRIXEL_POINTS,
  SET_FAVORITES,
  SET_LOGGED_IN_USER,
  SET_USER_PROPERTIES,
} from '../actions/types/UserTypes';

export const defaultState = {
  activeUserType: null,
  awards: [],
  brixelPoint: [],
  favorites: [],
  loggedUser: {},
  userProperties: [],
};

export default handleActions(
  {
    [SET_USER_TYPES]: (state, action) => ({
      ...state,
      activeUserType: action.payload,
    }),
    [SET_AWARDS]: (state, action) => ({
      ...state,
      awards: action.payload,
    }),
    [SET_BRIXEL_POINTS]: (state, action) => ({
      ...state,
      brixelPoint: action.payload,
    }),
    [SET_FAVORITES]: (state, action) => ({
      ...state,
      favorites: action.payload,
    }),
    [SET_LOGGED_IN_USER]: (state, action) => ({
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
