import { handleActions } from 'redux-actions';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import Cookies from 'universal-cookie';
import { countryList } from '@brixel/brixel-components';

import {
  ERROR_MESSAGE,
  REDIRECT_TO,
  REQUEST_DONE,
  RESET_REQUEST,
  SPINNER_OFF,
  SPINNER_ON,
  SPINNER_SMALL_OFF,
  SPINNER_SMALL_ON,
  SET_LANGUAGES,
  SET_LANGUAGE,
  SET_SCREEN_NOTIFICATION,
  SET_PAGE_DATA, SET_MODAL,
  PREVENT_EXIT_FROM_SCREEN,
  SET_UNSAVED_CHANGES_MODAL,
  SET_WINDOW_DIMENSIONS,
  SET_UPLOADING_PERCENTAGE,
  SET_COUNTRY_LIST,
  SET_FORM_ERROR,
  SKELETON_ON,
  SKELETON_OFF,
} from '../actions/types/CommonTypes';

const cookie = new Cookies();

export const defaultState = {
  windowDimensions: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  formError: {},
  isLoading: 1,
  isSmallLoading: null,
  requestDone: false,
  redirectTo: null,
  configUrl: getConfigEnv,
  errorMsg: {},
  languages: [
    { value: 'de', label: 'de' },
    { value: 'dk', label: 'dk' },
    { value: 'en', label: 'en' },
    { value: 'nl', label: 'nl' },
    { value: 'pt', label: 'pt' },
    { value: 'se', label: 'se' },
  ],
  country: countryList,
  language: cookie.get('brixelLang') || 'en',
  notification: {},
  setPageData: null,
  modal: {
    state: false, title: '', body: '', action: {}, multiActions: [],
  },
  preventExitFromScreen: false,
  unsavedChangesModal: {
    state: false, link: '',
  },
  percentage: 0,
  skeleton: { },
};

export default handleActions(
  {
    [SET_WINDOW_DIMENSIONS]: (state, action) => ({
      ...state,
      windowDimensions: action.payload,
    }),
    [SPINNER_ON]: (state) => ({
      ...state,
      isLoading: state.isLoading + 1,
    }),
    [SET_COUNTRY_LIST]: (state, action) => ({
      ...state,
      country: action.payload,
    }),
    [SPINNER_OFF]: (state) => ({
      ...state,
      isLoading: state.isLoading - 1,
    }),
    [SPINNER_SMALL_ON]: (state, action) => ({
      ...state,
      isSmallLoading: action.payload,
    }),
    [SPINNER_SMALL_OFF]: (state) => ({
      ...state,
      isSmallLoading: null,
    }),
    [REQUEST_DONE]: (state) => ({
      ...state,
      requestDone: true,
    }),
    [RESET_REQUEST]: (state) => ({
      ...state,
      requestDone: false,
    }),
    [REDIRECT_TO]: (state, action) => ({
      ...state,
      redirectTo: action.payload,
    }),
    [ERROR_MESSAGE]: (state, action) => ({
      ...state,
      errorMsg: action.payload,
    }),
    [SET_LANGUAGES]: (state, action) => ({
      ...state,
      languages: action.payload,
    }),
    [SET_LANGUAGE]: (state, action) => ({
      ...state,
      language: action.payload,
    }),
    [SET_SCREEN_NOTIFICATION]: (state, action) => ({
      ...state,
      notification: action.payload,
    }),
    [SET_MODAL]: (state, action) => ({
      ...state,
      modal: action.payload,
    }),
    [SET_PAGE_DATA]: (state, action) => ({
      ...state,
      setPageData: action.payload,
    }),
    [PREVENT_EXIT_FROM_SCREEN]: (state, action) => ({
      ...state,
      preventExitFromScreen: action.payload,
    }),
    [SET_UNSAVED_CHANGES_MODAL]: (state, action) => ({
      ...state,
      unsavedChangesModal: action.payload,
    }),
    [SET_UPLOADING_PERCENTAGE]: (state, action) => ({
      ...state,
      percentage: action.payload,
    }),
    [SET_FORM_ERROR]: (state, action) => ({
      ...state,
      formError: action.payload,
    }),
    [SKELETON_ON]: (state, action) => ({
      ...state,
      skeleton: action.payload,
    }),
    [SKELETON_OFF]: (state) => ({
      ...state,
      skeleton: { },
    }),
  },
  defaultState,
);
