import { createActions } from 'redux-actions';
import {
  GET_ACTIVE_SINGLE_COMPANY,
  SET_ACTIVE_SINGLE_COMPANY,
  GET_COMPANY_BY_COUNTRY,
} from './types/CompanyTypes';

export const {
  getActiveSingleCompany,
  getCompanyByCountry,
} = createActions({
  [GET_ACTIVE_SINGLE_COMPANY]: (payload) => payload,
  [SET_ACTIVE_SINGLE_COMPANY]: (payload) => payload,
  [GET_COMPANY_BY_COUNTRY]: (payload) => payload,
});
