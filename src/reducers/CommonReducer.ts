import {countryList} from '@brixel-io/brixel-components';
import getConfigEnv from '@brixel-io/brixel-components/dist/configuration/Settings';
import {handleActions} from 'redux-actions';
import type {CommonReducerType} from '../@types/reducer/CommonReducer';

import {
  PREVENT_EXIT_FROM_SCREEN,
  REDIRECT_TO,
  REQUEST_DONE,
  SET_COUNTRY_LIST,
  SET_FEATURE_FLAGS,
  SET_FORM_ERROR,
  SET_HISTORY,
  SET_LANGUAGE,
  SET_MODAL,
  SET_NOTIFICATION,
  SET_PAGE_DATA,
  SET_SPLASH_TYPE,
  SET_TRANSLATIONS,
  SET_UNSAVED_CHANGES_MODAL,
  SET_WINDOW_DIMENSIONS,
  SET_WIZARD,
  SKELETON_OFF,
  SKELETON_ON,
  SPINNER_OFF,
  SPINNER_ON,
  SPINNER_SMALL,
  SPINNER_SMALL_OFF,
} from '../actions/types/CommonTypes';
import {languagesList} from '@brixel-io/brixel-components/dist/configuration/Constants';

export const defaultState: CommonReducerType = {
  configUrl: getConfigEnv,
  country: countryList,
  errorMsg: {},
  featureFlags: {},
  formError: {},
  history: {},
  isLoading: 1,
  isSmallLoading: {},
  // @ts-ignore
  isTest: typeof window?.Cypress !== 'undefined',
  language: null,
  languages: getConfigEnv?.languages || [],
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
  translation: {},
  unsavedChangesModal: {
    state: false, link: '',
  },
  windowDimensions: {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  },
  wizard: {},
};

const convertLanguage = (lng) => {
  let lang = 'en';
  const checkLangExist = languagesList.find((lg) => lg.code === lng);
  if (checkLangExist) lang = lng;
  return lang;
}

export default handleActions<CommonReducerType>(
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
      isLoading: state.isLoading > 0 ? state.isLoading - 1 : 0,
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
      requestDone: Boolean(action.payload),
    }),
    [SET_LANGUAGE]: (state, action) => ({
      ...state,
      language: convertLanguage(action.payload),
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
      preventExitFromScreen: Boolean(action.payload),
    }),
    [SET_UNSAVED_CHANGES_MODAL]: (state, action) => ({
      ...state,
      unsavedChangesModal: action.payload,
    }),
    [SET_FORM_ERROR]: (state, action) => ({
      ...state,
      formError: action.payload,
    }),
    [SKELETON_ON]: (state, action) => {
      return ({
        ...state,
        skeleton: {
          ...state.skeleton,
          ...action.payload,
        },
      })
    },
    [SKELETON_OFF]: (state, action) => {
      return ({
        ...state,
        skeleton: {
          ...state.skeleton,
          ...action.payload,
        },
      })
    },
    [SET_SPLASH_TYPE]: (state, action) => ({
      ...state,
      splashScreenType: action.payload.toString(),
    }),
    [SET_HISTORY]: (state, action) => ({
      ...state,
      history: action.payload,
    }),
    [SET_WIZARD]: (state, action) => ({
      ...state,
      wizard: action.payload,
    }),
    [SET_FEATURE_FLAGS]: (state, action) => ({
      ...state,
      featureFlags: action.payload,
    }),
    [SET_TRANSLATIONS]: (state, action) => ({
      ...state,
      translations: action.payload,
    }),
  },
  defaultState,
);
