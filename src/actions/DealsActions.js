import { createActions } from 'redux-actions';
import {
  GET_USER_DEALS,
  SET_USER_DEALS,
  SAVE_ACTIVE_SINGLE_DEAL,
} from './types/DealsTypes';

export const {
  getUserDeals,
  setUserDeals,
  saveActiveSingleDeal,
} = createActions({
  [GET_USER_DEALS]: (payload) => payload,
  [SET_USER_DEALS]: (payload) => payload,
  [SAVE_ACTIVE_SINGLE_DEAL]: (payload) => payload,
});
