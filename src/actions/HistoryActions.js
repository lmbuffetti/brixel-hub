import {
  createActions,
} from 'redux-actions';
import {
  CREATE_HISTORY,
  DELETE_ACTIVE_SINGLE_HISTORY,
  GET_HISTORY_LISTINGS,
  SET_PROPERTY_HISTORY_LISTINGS,
  SET_PROPERTY_OWNER_HISTORY_LISTINGS,
  SET_USER_HISTORY_LISTINGS,
  SET_DEAL_HISTORY_LISTINGS,
  SET_DEAL_OWNER_HISTORY_LISTINGS,
  GET_HISTORY_FEED,
  SET_HISTORY_FEED,
} from './types/HistoryTypes';

export const {
  createHistory,
  deleteActiveSingleHistory,
  getHistoryListings,
  setPropertyHistoryListings,
  setPropertyOwnerHistoryListings,
  setUserHistoryListings,
  setDealHistoryListings,
  setDealOwnerHistoryListings,
  getHistoryFeed,
  setHistoryFeed,
} = createActions({
  [CREATE_HISTORY]: (payload) => payload,
  [DELETE_ACTIVE_SINGLE_HISTORY]: (payload) => payload,
  [GET_HISTORY_LISTINGS]: (payload) => payload,
  [SET_PROPERTY_HISTORY_LISTINGS]: (payload) => payload,
  [SET_PROPERTY_OWNER_HISTORY_LISTINGS]: (payload) => payload,
  [SET_USER_HISTORY_LISTINGS]: (payload) => payload,
  [SET_DEAL_HISTORY_LISTINGS]: (payload) => payload,
  [SET_DEAL_OWNER_HISTORY_LISTINGS]: (payload) => payload,
  [GET_HISTORY_FEED]: (payload) => payload,
  [SET_HISTORY_FEED]: (payload) => payload,
});
