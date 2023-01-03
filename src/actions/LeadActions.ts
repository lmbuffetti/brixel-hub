import {createActions,} from 'redux-actions';
import {GET_GLOBAL_LEAD_LISTINGS, SET_GLOBAL_LEAD_LISTINGS,} from './types/LeadTypes';

export const {
  getGlobalLeadListings,
  setGlobalLeadListings,
} = createActions({
  [GET_GLOBAL_LEAD_LISTINGS]: (payload) => payload,
  [SET_GLOBAL_LEAD_LISTINGS]: (payload) => payload,
});
