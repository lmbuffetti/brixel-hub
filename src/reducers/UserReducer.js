import { handleActions } from 'redux-actions';
import {
  SET_USER_TYPES,
  SET_LOGGED_IN_USER,
  SET_USER_PROPERTIES,
  SET_USER_PAGES_DEALS,
} from '../actions/types/UserTypes';

import {
  SET_USER_SEARCH_PROFILES,
} from '../actions/types/SearchProfileTypes';

export const defaultState = {
  userTypes: '',
  loggedInUser: {},
  userSearchProfiles: null,
  userProperties: [],
  userBuyerProperties: [],
};

export default handleActions(
  {
    [SET_USER_TYPES]: (state, action) => ({
      ...state,
      userTypes: action.payload,
    }),
    [SET_LOGGED_IN_USER]: (state, action) => ({
      ...state,
      loggedInUser: action.payload,
    }),
    [SET_USER_PROPERTIES]: (state, action) => ({
      ...state,
      userProperties: action.payload,
    }),
    [SET_USER_PAGES_DEALS]: (state, action) => ({
      ...state,
      userBuyerProperties: action.payload,
    }),
    [SET_USER_SEARCH_PROFILES]: (state, action) => ({
      ...state,
      userSearchProfiles: action.payload,
    }),
  },
  defaultState,
);
