import { handleActions } from 'redux-actions';

import {
  SET_ACTIVE_SINGLE_COMPANY,
} from '../actions/types/CompanyTypes';

export const defaultState = {
  company: {},
};

export default handleActions(
  {
    [SET_ACTIVE_SINGLE_COMPANY]: (state, action) => ({
      ...state,
      company: action.payload,
    }),
  },
  defaultState,
);
