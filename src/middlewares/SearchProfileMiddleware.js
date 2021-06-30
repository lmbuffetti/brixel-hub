import get from 'lodash/get';
import {
  GET_USER_SEARCH_PROFILES,
  SET_USER_SEARCH_PROFILES,
  UPDATE_USER_SEARCH_PROFILE,
} from '../actions/types/SearchProfileTypes';

import {
  SPINNER_ON,
  SPINNER_OFF, SET_SCREEN_NOTIFICATION,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkSearchProfile = (store) => (next) => (action) => {
  switch (action.type) {
    // DISPATCH TO GET THE SINGLE COMAPNY BY stub OR BY id
    case GET_USER_SEARCH_PROFILES: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.searchProfile.searchProfileByUserID(action.payload)
        .then((res) => {
          if (res.meta.normalizedStatus === 200) {
            store.dispatch({ type: SET_USER_SEARCH_PROFILES, payload: res.data });
            store.dispatch({
              type: SPINNER_OFF,
            });
          } else {
            store.dispatch({ type: SET_USER_SEARCH_PROFILES, payload: [{}] });
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        })
        .catch(() => {
          store.dispatch({ type: SET_USER_SEARCH_PROFILES, payload: [{}] });
          store.dispatch({
            type: SPINNER_OFF,
          });
        });
      break;
    }
    case UPDATE_USER_SEARCH_PROFILE: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const token = get(action, 'payload.token', null);
      const addSearchProfile = get(action, 'payload.addSearchProfile', false);
      const extraLoading = get(action.payload, 'extraLoading', false);
      const { redirectToUrl } = action.payload;
      api.searchProfile.updateSearchProfile(action.payload.dataSearchProfile, token)
        .then(() => {
          store.dispatch({
            type: SET_SCREEN_NOTIFICATION,
            payload: {
              state: true,
              type: 'done',
            },
          });
          if (redirectToUrl) {
            window.location.href = redirectToUrl;
          } else if (addSearchProfile) {
            // window.location.href = '/home';
            window.location.href = '/buy';
          } else if (extraLoading) store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkSearchProfile;
