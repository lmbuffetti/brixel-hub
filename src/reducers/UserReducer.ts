import {handleActions} from 'redux-actions';

import {SET_USER_ACTIVE_SEARCH_PROFILE, SET_USER_SEARCH_PROFILES} from '../actions/types/SearchProfileTypes';
import {
  SET_LOGGED_IN_USER,
  SET_USER_PAGES_DEALS,
  SET_USER_PROPERTIES,
  SET_USER_TYPES,
  SET_USER_RATE,
} from '../actions/types/UserTypes';
import type {UserReducerType} from '../@types/reducer/UserReducer';

export const defaultState: UserReducerType = {
  activeSearchProfile: null,
  loggedInUser: {},
  userBuyerProperties: [],
  userProperties: [],
  userSearchProfiles: null,
  userTypes: '',
  userRate: null,
};

export default handleActions<any>(
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
    [SET_USER_ACTIVE_SEARCH_PROFILE]: (state, action) => ({
      ...state,
      activeSearchProfile: action.payload,
    }),
    [SET_USER_RATE]: (state, action) => ({
      ...state,
      userRate: action.payload,
    }),
  },
  defaultState,
);
