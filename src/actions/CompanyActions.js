import { createActions } from 'redux-actions';
import {
  GET_ACTIVE_SINGLE_COMPANY,
  SET_ACTIVE_SINGLE_COMPANY,
} from './types/CompanyTypes';

export const {
  getActiveSingleCompany,
} = createActions({
  [GET_ACTIVE_SINGLE_COMPANY]: (payload) => payload,
  [SET_ACTIVE_SINGLE_COMPANY]: (payload) => payload,
});
