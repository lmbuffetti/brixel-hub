import { createActions } from 'redux-actions';
import { GET_ACTIVE_SINGLE_COMPANY, GET_ACTIVE_SINGLE_COMPANY_PACKAGES, GET_COMPANY_LISTING, SET_ACTIVE_SINGLE_COMPANY, SET_ACTIVE_SINGLE_COMPANY_PACKAGES, SET_COMPANY_LISTING, } from './types/CompanyTypes';
export const { getActiveSingleCompany, setActiveSingleCompany, getActiveSingleCompanyPackages, setActiveSingleCompanyPackages, getCompanyListing, setCompanyListing, } = createActions({
    [GET_ACTIVE_SINGLE_COMPANY]: (payload) => payload,
    [SET_ACTIVE_SINGLE_COMPANY]: (payload) => payload,
    [GET_COMPANY_LISTING]: (payload) => payload,
    [SET_COMPANY_LISTING]: (payload) => payload,
    [GET_ACTIVE_SINGLE_COMPANY_PACKAGES]: (payload) => payload,
    [SET_ACTIVE_SINGLE_COMPANY_PACKAGES]: (payload) => payload,
});
