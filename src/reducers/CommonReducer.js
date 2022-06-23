import { handleActions } from 'redux-actions';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import Cookies from 'universal-cookie';
import { countryList } from '@brixel/brixel-components';

import {
  REDIRECT_TO,
  SPINNER_OFF,
  SPINNER_ON,
  SPINNER_SMALL_OFF,
  SPINNER_SMALL,
  SET_LANGUAGE,
  SET_NOTIFICATION,
  SET_PAGE_DATA, SET_MODAL,
  PREVENT_EXIT_FROM_SCREEN,
  REQUEST_DONE,
  SET_UNSAVED_CHANGES_MODAL,
  SET_WINDOW_DIMENSIONS,
  SET_COUNTRY_LIST,
  SET_FORM_ERROR,
  SKELETON_ON,
  SKELETON_OFF,
  SET_SPLASH_TYPE,
  SET_HISTORY,
  SET_WIZARD,
} from '../actions/types/CommonTypes';

const cookie = new Cookies();

export const defaultState = {
  configUrl: getConfigEnv,
  country: countryList,
  errorMsg: {},
  formError: {},
  history: {},
  isLoading: 1,
  isSmallLoading: {},
  language: cookie.get('brixelLang') || 'en',
  languages: [
    { value: 'de', label: 'de' },
    { value: 'dk', label: 'dk' },
    { value: 'en', label: 'en' },
    { value: 'it', label: 'it' },
    { value: 'nl', label: 'nl' },
    { value: 'pt', label: 'pt' },
    { value: 'se', label: 'se' },
  ],
  modal: {
    state: false, title: '', body: '', action: {}, multiActions: [],
  },
  notification: [],
  percentage: 0,
  preventExitFromScreen: false,
  redirectTo: null,
  requestDone: false,
  setPageData: null,
  skeleton: { },
  splashScreenType: '',
  unsavedChangesModal: {
    state: false, link: '',
  },
  windowDimensions: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  wizard: {},
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
    [SPINNER_SMALL]: (state, action) => ({
      ...state,
      isSmallLoading: {
        ...state.isSmallLoading,
        ...action.payload,
      },
    }),
    [SPINNER_SMALL_OFF]: (state) => ({
      ...state,
      isSmallLoading: { },
    }),
    [REDIRECT_TO]: (state, action) => ({
      ...state,
      redirectTo: action.payload,
    }),
    [REQUEST_DONE]: (state, action) => ({
      ...state,
      requestDone: action.payload,
    }),
    [SET_LANGUAGE]: (state, action) => ({
      ...state,
      language: action.payload,
    }),
    [SET_NOTIFICATION]: (state, action) => ({
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
    [SET_FORM_ERROR]: (state, action) => ({
      ...state,
      formError: action.payload,
    }),
    [SKELETON_ON]: (state, action) => ({
      ...state,
      skeleton: action.payload,
    }),
    [SKELETON_OFF]: (state, action) => ({
      ...state,
      skeleton: action.payload,
    }),
    [SET_SPLASH_TYPE]: (state, action) => ({
      ...state,
      splashScreenType: action.payload,
    }),
    [SET_HISTORY]: (state, action) => ({
      ...state,
      history: action.payload,
    }),
    [SET_WIZARD]: (state, action) => ({
      ...state,
      wizard: action.payload,
    }),
  },
  defaultState,
);
