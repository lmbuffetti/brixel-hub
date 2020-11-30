import {
  GET_ACTIVE_SINGLE_COMPANY,
  SET_ACTIVE_SINGLE_COMPANY,
} from '../actions/types/CompanyTypes';

import api from '../controllers/api/config';
import {
  SPINNER_ON,
  SPINNER_OFF,
} from '../actions/types/CommonTypes';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    // DISPATCH TO GET THE SINGLE COMAPNY BY stub OR BY id
    case GET_ACTIVE_SINGLE_COMPANY: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      if (action.payload.stub) {
        if (action.payload.stub === 'default') {
          store.dispatch({ type: SPINNER_ON });
          api.company.getDefaultCompany()
            .then((res) => {
              if (typeof res.data.statusCode === 'undefined') {
                store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
                store.dispatch({ type: SPINNER_OFF });
              }
            });
        } else {
          store.dispatch({ type: SPINNER_ON });
          api.company.getCompanyByStub(action.payload.stub)
            .then((res) => {
              if (typeof res.data.statusCode === 'undefined') {
                store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
              } else {
                store.dispatch({ type: GET_ACTIVE_SINGLE_COMPANY, payload: { stub: 'default' } });
              }
              store.dispatch({ type: SPINNER_OFF });
            });
        }
      }
      if (action.payload.id) {
        store.dispatch({ type: SPINNER_ON });
        api.company.getCompanyById(action.payload.id)
          .then((res) => {
            if (typeof res.data.statusCode === 'undefined') {
              store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
            }
            store.dispatch({ type: SPINNER_OFF });
          });
      }
      store.dispatch({ type: SPINNER_OFF });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
