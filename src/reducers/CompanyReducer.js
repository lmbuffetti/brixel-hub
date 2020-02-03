import { handleActions } from 'redux-actions';

import {
  SET_COMPANY,
} from '../actions/types/CompanyTypes';

export const defaultState = {
  company: {},
};

export default handleActions(
  {
    [SET_COMPANY]: (state, action) => ({
      ...state,
      company: action.payload,
    }),
  },
  defaultState,
);
