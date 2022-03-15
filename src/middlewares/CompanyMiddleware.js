import { SPINNER_ON, SPINNER_SMALL } from '../actions/types/CommonTypes';
import {
  GET_ACTIVE_SINGLE_COMPANY,
  SET_ACTIVE_SINGLE_COMPANY,
  GET_ACTIVE_SINGLE_COMPANY_PACKAGES,
  SET_ACTIVE_SINGLE_COMPANY_PACKAGES,
  GET_COMPANY_LISTING,
  SET_COMPANY_LISTING,
} from '../actions/types/CompanyTypes';

import api from '../controllers/api/config';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    // DISPATCH TO GET THE SINGLE COMAPNY BY stub OR BY id
    case GET_ACTIVE_SINGLE_COMPANY: {
      next(action);
      if (action.payload.stub) {
        if (action.payload.stub === 'default') {
          api.company.getDefaultCompany()
            .then((res) => {
              if (typeof res.data.statusCode === 'undefined') {
                store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
              }
            });
        } else {
          api.company.getCompanyByStub(action.payload.stub)
            .then((res) => {
              if (typeof res.data.statusCode === 'undefined') {
                store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
              } else {
                store.dispatch({ type: GET_ACTIVE_SINGLE_COMPANY, payload: { stub: 'default' } });
              }
            });
        }
      }
      if (action.payload.id) {
        api.company.getCompanyById(action.payload.id)
          .then((res) => {
            if (typeof res.data.statusCode === 'undefined') {
              store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
            }
          });
      }
      break;
    }
    // GET COMPANY LISTING
    case GET_COMPANY_LISTING: {
      const searchData = '20/0?search=&order=createdAt&direction=ASC';
      api.company.getCompanyListing(searchData)
        .then((res) => {
          store.dispatch({ type: SET_COMPANY_LISTING, payload: res.data });
        });
      break;
    }
    // DISPATCH TO GET THE SINGLE COMAPNY BY stub OR BY id
    case GET_ACTIVE_SINGLE_COMPANY_PACKAGES: {
      next(action);
      const {
        id,
        smallLoader,
      } = action.payload;
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      } else {
        store.dispatch({
          type: SPINNER_ON,
        });
      }
      api.company.getPackagesCompany(id)
        .then((res) => {
          if (typeof res.data.statusCode === 'undefined') {
            store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY_PACKAGES, payload: res.data });
          }
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
