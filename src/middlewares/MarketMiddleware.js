import get from 'lodash/get';
import take from 'lodash/take';
import {
  GET_SELLER_PROPERTIES,
  SET_SELLER_PROPERTIES,
} from '../actions/types/MarketTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL_ON,
  SPINNER_SMALL_OFF,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkLead = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_SELLER_PROPERTIES: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON, payload: 'usrProperties' });
      console.log(action.payload);
      api.user.getPropertiesOfUser(action.payload.userId, action.payload.limit)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_SELLER_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SPINNER_SMALL_OFF });
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_SMALL_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkLead;
