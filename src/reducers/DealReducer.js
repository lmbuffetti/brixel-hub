import { handleActions } from 'redux-actions';

import {
  SET_USER_DEALS,
  SET_DEAL_LISTINGS,
  SET_ACTIVE_SINGLE_DEAL,
  SET_OFFER_LISTINGS,
  SET_ACTIVE_SINGLE_OFFER
} from '../actions/types/DealTypes';

import {
  SET_DEAL_NOTE_LISTINGS
} from '../actions/types/NoteTypes';

import {
  SET_DEAL_HISTORY_LISTINGS,
  SET_DEAL_OWNER_HISTORY_LISTINGS
} from '../actions/types/HistoryTypes';

export const defaultState = {
  activeSingleDeal: {},
  activeSingleDealHistory: {},
  activeSingleDealNotes: [],
  activeSingleDealOwnerHistory: {},
  dealListings: {},
  userDealListings: [],
  offerListings: []

};

export default handleActions(
  {
    [SET_USER_DEALS]: (state, action) => ({
      ...state,
      userDealListings: action.payload
    }),
    [SET_DEAL_LISTINGS]: (state, action) => ({
      ...state,
      dealListings: action.payload
    }),
    [SET_ACTIVE_SINGLE_DEAL]: (state, action) => ({
      ...state,
      activeSingleDeal: action.payload
    }),
    [SET_DEAL_NOTE_LISTINGS]: (state, action) => ({
      ...state,
      activeSingleDealNotes: action.payload
    }),
    [SET_DEAL_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSingleDealHistory: action.payload
    }),
    [SET_DEAL_OWNER_HISTORY_LISTINGS]: (state, action) => ({
      ...state,
      activeSingleDealOwnerHistory: action.payload
    }),
    [SET_OFFER_LISTINGS]: (state, action) => ({
      ...state,
      offerListings: action.payload
    }),
    [SET_ACTIVE_SINGLE_OFFER]: (state, action) => ({
      ...state,
      activeSingleOffer: action.payload
    })
  },
  defaultState
);
