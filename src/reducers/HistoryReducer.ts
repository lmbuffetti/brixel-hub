import {handleActions} from 'redux-actions';

import {
  SET_PROPERTY_HISTORY_LISTINGS,
  SET_PROPERTY_OWNER_HISTORY_LISTINGS,
  SET_USER_HISTORY_LISTINGS,
} from '../actions/types/HistoryTypes';
import type {HistoryReducerType} from '../@types/reducer/HistoryReducer';

export const defaultState: HistoryReducerType = {
  activeSinglePropertyHistory: {},
  activeSingleUserHistory: {},
  activeSinglePropertyOwnerHistory: {},
};

export default handleActions<HistoryReducerType>(
  {
    [SET_PROPERTY_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSinglePropertyHistory: action.payload,
    }),
    [SET_PROPERTY_OWNER_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSinglePropertyOwnerHistory: action.payload,
    }),
    [SET_USER_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSingleUserHistory: action.payload,
    }),
  },
  defaultState,
);
