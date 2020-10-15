import cloneDeep from 'lodash/cloneDeep';
import {
  SPINNER_ON,
  SPINNER_OFF,
} from '../actions/types/CommonTypes';

import {
  GET_USER_DEALS,
  SET_USER_DEALS,
  SAVE_ACTIVE_SINGLE_DEAL,
} from '../actions/types/DealsTypes';

import api from '../controllers/api/config';
import { GET_USER_PAGES_DEALS } from '../actions/types/UserTypes';

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
    case SAVE_ACTIVE_SINGLE_DEAL: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const obj = cloneDeep(action.payload.data);
      api.deal.updateSingleDeal(action.payload.id, obj)
        .then(() => {
          store.dispatch({ type: GET_USER_PAGES_DEALS, payload: action.payload.userID });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
