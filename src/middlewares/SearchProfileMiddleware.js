import get from 'lodash/get';

import {
  REDIRECT_TO,
  SET_SCREEN_NOTIFICATION,
  SPINNER_OFF,
  SPINNER_ON,
  SPINNER_SMALL,
} from '../actions/types/CommonTypes';
import {
  CREATE_USER_SEARCH_PROFILE,
  GET_USER_SEARCH_PROFILES,
  SET_USER_ACTIVE_SEARCH_PROFILE,
  SET_USER_SEARCH_PROFILES,
  UPDATE_USER_SEARCH_PROFILE,
} from '../actions/types/SearchProfileTypes';
import { SAVE_ACTIVE_SINGLE_USER } from '../actions/types/UserTypes';

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
            const searchProfiles = res.data;
            store.dispatch({ type: SET_USER_SEARCH_PROFILES, payload: searchProfiles });
            store.dispatch({
              type: SPINNER_OFF,
            });
            const getActiveSearchProfile = searchProfiles.find((srchPrf) => srchPrf.isDefault);
            if (getActiveSearchProfile) store.dispatch({ type: SET_USER_ACTIVE_SEARCH_PROFILE, payload: getActiveSearchProfile });
            else store.dispatch({ type: SET_USER_ACTIVE_SEARCH_PROFILE, payload: searchProfiles[0] });
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
    case CREATE_USER_SEARCH_PROFILE: {
      next(action);
      const token = get(action, 'payload.token', null);
      const addSearchProfile = get(action, 'payload.addSearchProfile', false);
      const { redirectToUrl, smallLoader, termsBaloiseBank, termsBaloiseInsurance, termsUBS } = action.payload;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: true } });
      else store.dispatch({ type: SPINNER_ON });
      delete action.payload.termsBaloiseBank;
      delete action.payload.termsBaloiseInsurance;
      delete action.payload.termsUBS;
      api.searchProfile.createSearchProfile(action.payload.dataSearchProfile, token)
        .then((res) => {
          store.dispatch({
            type: SET_SCREEN_NOTIFICATION,
            payload: {
              state: true,
              type: 'done',
            },
          });
          store.dispatch({
            type: GET_USER_SEARCH_PROFILES,
            payload: res.data.user,
          });
          if (termsBaloiseBank || termsBaloiseInsurance) {
            const data = {
              id: res.data.user,
              termsBaloiseBank: true,
              termsBaloiseInsurance: true,
            }
            store.dispatch({
              type: SAVE_ACTIVE_SINGLE_USER,
              payload: data,
            });
          }
          if (termsUBS) {
            const data = {
              id: res.data.user,
              termsUBS: true,
            }
            store.dispatch({
              type: SAVE_ACTIVE_SINGLE_USER,
              payload: data,
            });
          }
          if (redirectToUrl) {
            store.dispatch({ type: REDIRECT_TO, payload: { history: redirectToUrl } });
            // window.location.assign(redirectToUrl);
          } else if (addSearchProfile) {
            // window.location.href = '/home';
            window.location.assign('/buy');
          }
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: false } });
          else store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case UPDATE_USER_SEARCH_PROFILE: {
      next(action);
      const addSearchProfile = get(action, 'payload.addSearchProfile', false);
      const {
        dataSearchProfile,
        id,
        redirectToUrl,
        smallLoader,
      } = action.payload;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: true } });
      else store.dispatch({ type: SPINNER_ON });
      api.searchProfile.updateSearchProfile(dataSearchProfile, id)
        .then((res) => {
          store.dispatch({
            type: GET_USER_SEARCH_PROFILES,
            payload: res.data.user,
          });
          if (redirectToUrl) {
            store.dispatch({ type: REDIRECT_TO, payload: { history: redirectToUrl } });
            // window.location.assign(redirectToUrl);
          } else if (addSearchProfile) {
            // window.location.href = '/home';
            window.location.assign('/buy');
          }
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: false } });
          else store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkSearchProfile;
