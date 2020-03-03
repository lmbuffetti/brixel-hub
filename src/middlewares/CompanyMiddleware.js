import {
  GET_COMPANY,
  SET_COMPANY,
} from '../actions/types/CompanyTypes'

import api from '../controllers/api/config';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_COMPANY: {
      next(action);
      api.company.getCompanyByStub(action.payload.stub)
        .then((res) => {
          store.dispatch({ type: SET_COMPANY, payload: res.data });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
