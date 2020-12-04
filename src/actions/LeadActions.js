import {
  createActions,
} from 'redux-actions';
import {
  GET_LEAD_LISTINGS,
  GET_GLOBAL_LEAD_LISTINGS,
  SET_GLOBAL_LEAD_LISTINGS,
} from './types/LeadTypes';

export const {
  getLeadListings,
  getGlobalLeadListings,
  setGlobalLeadListings,
} = createActions({
  [GET_LEAD_LISTINGS]: (payload) => payload,
  [GET_GLOBAL_LEAD_LISTINGS]: (payload) => payload,
  [SET_GLOBAL_LEAD_LISTINGS]: (payload) => payload,
});
