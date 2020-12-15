import {
  createActions,
} from 'redux-actions';
import {
  CREATE_DEAL,
  DELETE_ACTIVE_SINGLE_DEAL,
  GET_DEAL_LISTINGS,
  SET_DEAL_LISTINGS,
  GET_ACTIVE_SINGLE_DEAL,
  SET_ACTIVE_SINGLE_DEAL,
  SAVE_ACTIVE_SINGLE_DEAL,
  UPDATE_DEALS_ORDER,
  UPDATE_MULTIPLE_DEALS,
  GET_USER_DEALS,
  SET_USER_DEALS,
} from './types/DealsTypes';

export const {
  createDeal,
  deleteActiveSingleDeal,
  getDealListings,
  setDealListings,
  getActiveSingleDeal,
  setActiveSingleDeal,
  saveActiveSingleDeal,
  updateDealsOrder,
  updateMultipleDeals,
  getUserDeals,
  setUserDeals,
} = createActions({
  [CREATE_DEAL]: (payload) => payload,
  [DELETE_ACTIVE_SINGLE_DEAL]: (payload) => payload,
  [GET_DEAL_LISTINGS]: (payload) => payload,
  [SET_DEAL_LISTINGS]: (payload) => payload,
  [GET_ACTIVE_SINGLE_DEAL]: (payload) => payload,
  [SET_ACTIVE_SINGLE_DEAL]: (payload) => payload,
  [SAVE_ACTIVE_SINGLE_DEAL]: (payload) => payload,
  [UPDATE_DEALS_ORDER]: (payload) => payload,
  [UPDATE_MULTIPLE_DEALS]: (payload) => payload,
  [GET_USER_DEALS]: (payload) => payload,
  [SET_USER_DEALS]: (payload) => payload,
});
