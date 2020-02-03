import { createActions } from 'redux-actions';
import {
  GET_COMPANY,
  SET_COMPANY,
} from './types/CompanyTypes';

export const {
  getCompany
} = createActions({
  [GET_COMPANY]: (payload) => payload,
  [SET_COMPANY]: (payload) => payload,
});
