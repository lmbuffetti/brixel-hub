import {
  SPINNER_ON,
  SPINNER_OFF,
} from '../actions/types/CommonTypes';

import {
  GET_USER_DEALS,
  SET_USER_DEALS,
} from '../actions/types/DealsTypes';

import api from '../controllers/api/config';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_USER_DEALS: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.user.getPagesByDealByUser(action.payload)
        .then((res) => {
          store.dispatch({ type: SET_USER_DEALS, payload: res.data });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
