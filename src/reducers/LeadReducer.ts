import {handleActions,} from 'redux-actions';
import {SET_GLOBAL_LEAD_LISTINGS,} from '../actions/types/LeadTypes';

export const defaultState = {
  globalListings: {
    properties: {
      data: [],
      total: 0,
    },
    users: {
      data: [],
      total: 0,
    },
  },
};

export default handleActions(
  {
    [SET_GLOBAL_LEAD_LISTINGS]: (state, action) => ({
      ...state,
      globalListings: action.payload,
    }),
  },
  defaultState,
);
