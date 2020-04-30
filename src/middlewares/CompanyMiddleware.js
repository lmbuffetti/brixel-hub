import {
  GET_ACTIVE_SINGLE_COMPANY,
  SET_ACTIVE_SINGLE_COMPANY,
} from '../actions/types/CompanyTypes'

import api from '../controllers/api/config';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_ACTIVE_SINGLE_COMPANY: {
      next(action);
      if (action.payload.stub) {
        api.company.getCompanyByStub(action.payload.stub)
          .then((res) => {
            store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
          });
      }
      if (action.payload.id) {
        api.company.getCompanyById(action.payload.id)
          .then((res) => {
            store.dispatch({ type: SET_ACTIVE_SINGLE_COMPANY, payload: res.data });
          });
      }
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
