import {handleActions} from 'redux-actions';

import {
  SET_ACTIVE_SINGLE_COMPANY,
  SET_ACTIVE_SINGLE_COMPANY_PACKAGES,
  SET_COMPANY_LISTING,
} from '../actions/types/CompanyTypes';
import type {CompanyReducerType} from '../@types/reducer/CompanyReducer';

export const defaultState: CompanyReducerType = {
  activeSingleCompany: {},
  activeSingleCompanyPackages: [],
  companyListings: [],
};

export default handleActions<any>(
  {
    [SET_ACTIVE_SINGLE_COMPANY]: (state, action) => ({
      ...state,
      activeSingleCompany: action.payload,
    }),
    [SET_COMPANY_LISTING]: (state, action) => ({
      ...state,
      companyListings: action.payload,
    }),
    [SET_ACTIVE_SINGLE_COMPANY_PACKAGES]: (state, action) => ({
      ...state,
      activeSingleCompanyPackages: action.payload,
    }),
  },
  defaultState,
);
