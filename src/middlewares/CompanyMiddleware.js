import {
  GET_ACTIVE_SINGLE_COMPANY,
  SET_ACTIVE_SINGLE_COMPANY,
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
              if (typeof res.data.status === 'undefined') {
                store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
              }
            });
        } else {
          api.company.getCompanyByStub(action.payload.stub)
            .then((res) => {
              if (typeof res.data.status === 'undefined') {
                store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
              }
            });
        }
      }
      if (action.payload.id) {
        api.company.getCompanyById(action.payload.id)
          .then((res) => {
            if (typeof res.data.status === 'undefined') {
              store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
            }
          });
      }
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
