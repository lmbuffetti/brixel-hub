import {handleActions} from 'redux-actions';

import {SET_ACTIVE_SINGLE_DEAL, SET_OFFER_LISTINGS} from '../actions/types/DealTypes';

import {SET_DEAL_NOTE_LISTINGS} from '../actions/types/NoteTypes';

import {SET_DEAL_HISTORY_LISTINGS, SET_DEAL_OWNER_HISTORY_LISTINGS} from '../actions/types/HistoryTypes';
import type {DealReducerType} from '../@types/reducer/DealReducer';

export const defaultState: DealReducerType = {
  activeSingleDeal: {},
  activeSingleDealHistory: {},
  activeSingleDealNotes: [],
  activeSingleDealOwnerHistory: {},
  offerListings: [],
};

export default handleActions<any>(
  {
    [SET_ACTIVE_SINGLE_DEAL]: (state, action) => ({
      ...state,
      activeSingleDeal: action.payload,
    }),
    [SET_DEAL_NOTE_LISTINGS]: (state, action) => ({
      ...state,
      activeSingleDealNotes: action.payload,
    }),
    [SET_DEAL_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSingleDealHistory: action.payload,
    }),
    [SET_DEAL_OWNER_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSingleDealOwnerHistory: action.payload,
    }),
    [SET_OFFER_LISTINGS]: (state, action) => ({
      ...state,
      offerListings: action.payload,
    }),
  },
  defaultState,
);
