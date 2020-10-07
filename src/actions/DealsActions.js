import { createActions } from 'redux-actions';
import {
  GET_USER_DEALS,
  SET_USER_DEALS,
} from './types/DealsTypes';

export const {
  getUserDeals,
  setUserDeals,
} = createActions({
  [GET_USER_DEALS]: (payload) => payload,
  [SET_USER_DEALS]: (payload) => payload,
});
