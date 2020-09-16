import { handleActions } from 'redux-actions';
import {
  SET_USER_TYPES,
  SET_AWARDS,
  SET_BRIXEL_POINTS,
  SET_FAVORITES,
  SET_LOGGED_IN_USER,
  SET_USER_PROPERTIES,
  SET_USER_BUYER_PROPERTIES,
} from '../actions/types/UserTypes';

export const defaultState = {
  userTypes: null,
  awards: 0,
  brixelPoints: 0,
  favorites: [],
  loggedInUser: {},
  userProperties: [],
  userBuyerProperties: [],
};

export default handleActions(
  {
    [SET_USER_TYPES]: (state, action) => ({
      ...state,
      userTypes: action.payload,
    }),
    [SET_AWARDS]: (state, action) => ({
      ...state,
      awards: action.payload,
    }),
    [SET_BRIXEL_POINTS]: (state, action) => ({
      ...state,
      brixelPoints: action.payload,
    }),
    [SET_FAVORITES]: (state, action) => ({
      ...state,
      favorites: action.payload,
    }),
    [SET_LOGGED_IN_USER]: (state, action) => ({
      ...state,
      loggedInUser: action.payload,
    }),
    [SET_USER_PROPERTIES]: (state, action) => ({
      ...state,
      userProperties: action.payload,
    }),
    [SET_USER_BUYER_PROPERTIES]: (state, action) => ({
      ...state,
      userBuyerProperties: action.payload,
    }),
  },
  defaultState,
);
