import { createActions } from 'redux-actions';
import {
  ERROR_MESSAGE,
  SPINNER_OFF,
  SPINNER_ON,
  REDIRECT_TO,
  REQUEST_DONE,
  RESET_REQUEST,
  SET_LANGUAGES,
  SET_NOTIFICATION,
  SET_PAGE_DATA,
} from './types/CommonTypes';

export const {
  errorMessage,
  spinnerOn,
  spinnerOff,
  redirectTo,
  requestDone,
  resetRequest,
  setLanguages,
  setNotification,
  setPageData,
} = createActions({
  [ERROR_MESSAGE]: (payload) => payload,
  [REDIRECT_TO]: (payload) => payload,
  [REQUEST_DONE]: (payload) => payload,
  [RESET_REQUEST]: (payload) => payload,
  [SPINNER_ON]: (payload) => payload,
  [SPINNER_OFF]: (payload) => payload,
  [SET_LANGUAGES]: (payload) => payload,
  [SET_NOTIFICATION]: (payload) => payload,
  [SET_PAGE_DATA]: (payload) => payload,
});
