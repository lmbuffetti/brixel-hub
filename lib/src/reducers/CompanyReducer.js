import { handleActions } from 'redux-actions';
import { SET_ACTIVE_SINGLE_COMPANY, SET_ACTIVE_SINGLE_COMPANY_PACKAGES, SET_COMPANY_LISTING, } from '../actions/types/CompanyTypes';
export const defaultState = {
    activeSingleCompany: {},
    activeSingleCompanyPackages: [],
    companyListings: [],
};
export default handleActions({
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
}, defaultState);
