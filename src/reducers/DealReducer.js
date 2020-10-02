import { handleActions } from 'redux-actions';

import {
  SET_USER_DEALS,
} from '../actions/types/DealsTypes';

export const defaultState = {
  userDealListings: [],
};

export default handleActions(
  {
    [SET_USER_DEALS]: (state, action) => ({
      ...state,
      userDealListings: action.payload,
    }),
  },
  defaultState,
);
