import { createActions } from 'redux-actions';
import {
  CREATE_USER_SEARCH_PROFILE,
  DELETE_USER_SEARCH_PROFILE,
  GET_USER_SEARCH_PROFILES,
  SET_USER_ACTIVE_SEARCH_PROFILE,
  SET_USER_SEARCH_PROFILES,
  UPDATE_USER_SEARCH_PROFILE,
} from './types/SearchProfileTypes';

export const {
  getUserSearchProfiles,
  setUserSearchProfiles,
  updateUserSearchProfile,
  createUserSearchProfile,
  setUserActiveSearchProfile,
  deleteUserSearchProfile,
} = createActions({
  [GET_USER_SEARCH_PROFILES]: (payload) => payload,
  [SET_USER_SEARCH_PROFILES]: (payload) => payload,
  [UPDATE_USER_SEARCH_PROFILE]: (payload) => payload,
  [CREATE_USER_SEARCH_PROFILE]: (payload) => payload,
  [SET_USER_ACTIVE_SEARCH_PROFILE]: (payload) => payload,
  [DELETE_USER_SEARCH_PROFILE]: (payload) => payload,
});
