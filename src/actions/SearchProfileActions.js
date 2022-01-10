import {
  createActions
} from 'redux-actions';
import {
  GET_USER_SEARCH_PROFILES,
  SET_USER_SEARCH_PROFILES,
  UPDATE_USER_SEARCH_PROFILE,
  CREATE_USER_SEARCH_PROFILE
} from './types/SearchProfileTypes';

export const {
  getUserSearchProfiles,
  setUserSearchProfiles,
  updateUserSearchProfile,
  createUserSearchProfile
} = createActions({
  [GET_USER_SEARCH_PROFILES]: (payload) => payload,
  [SET_USER_SEARCH_PROFILES]: (payload) => payload,
  [UPDATE_USER_SEARCH_PROFILE]: (payload) => payload,
  [CREATE_USER_SEARCH_PROFILE]: (payload) => payload
});
