import { handleActions } from 'redux-actions';
import { configLang } from '../constants/global';
import getConfigEnv from '@brixel/brixel-configuration-partner/src/Settings';
import {
  ERROR_MESSAGE,
  REDIRECT_TO,
  REQUEST_DONE,
  RESET_REQUEST,
  SPINNER_OFF,
  SPINNER_ON,
  SET_LANGUAGES,
  SET_NOTIFICATION,
} from '../actions/types/CommonTypes';

export const defaultState = {
  isLoading: 0,
  requestDone: false,
  redirectTo: null,
  configUrl: getConfigEnv,
  errorMsg: {},
  languages: [],
  notification: null,
};

export default handleActions(
  {
    [SPINNER_ON]: (state) => ({
      ...state,
      isLoading: state.isLoading + 1,
    }),
    [SPINNER_OFF]: (state) => ({
      ...state,
      isLoading: state.isLoading - 1,
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
    [SET_NOTIFICATION]: (state, action) => ({
      ...state,
      notification: action.payload,
    }),
  },
  defaultState,
);
