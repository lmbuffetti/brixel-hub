import { handleActions } from 'redux-actions';

import {
  SET_PROPERTY_HISTORY_LISTINGS,
  SET_PROPERTY_OWNER_HISTORY_LISTINGS,
  SET_HISTORY_FEED,
} from '../actions/types/HistoryTypes';

export const defaultState = {
  activeSinglePropertyHistory: {},
  activeSinglePropertyOwnerHistory: {},
  historyFeed: {},
};

export default handleActions(
  {
    [SET_PROPERTY_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSinglePropertyHistory: action.payload,
    }),
    [SET_PROPERTY_OWNER_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSinglePropertyOwnerHistory: action.payload,
    }),
    [SET_HISTORY_FEED]: (state, action) => ({
      ...state,
      historyFeed: action.payload,
    }),
  },
  defaultState,
);
