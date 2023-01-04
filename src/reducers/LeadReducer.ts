import {handleActions,} from 'redux-actions';
import {SET_GLOBAL_LEAD_LISTINGS,} from '../actions/types/LeadTypes';
import {LeadReducerType} from '../@types/reducer/LeadReducer';

export const defaultState: LeadReducerType = {
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

export default handleActions<any>(
  {
    [SET_GLOBAL_LEAD_LISTINGS]: (state, action) => ({
      ...state,
      globalListings: action.payload,
    }),
  },
  defaultState,
);
