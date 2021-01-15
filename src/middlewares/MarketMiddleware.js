import {
  GET_SELLER_PROPERTIES,
  SET_SELLER_PROPERTIES,
  GET_FAVORITES_PROPERTIES,
  SET_FAVORITES_PROPERTIES,
} from '../actions/types/MarketTypes';

import {
  SKELETON_ON,
  SKELETON_OFF,
  SPINNER_SMALL_ON,
  SPINNER_SMALL_OFF,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkLead = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_SELLER_PROPERTIES: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON, payload: 'usrProperties' });
      api.user.getPropertiesOfUser(action.payload.userId, action.payload.limit)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_SELLER_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SPINNER_SMALL_OFF });
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_SMALL_OFF });
        });
      break;
    }
    case GET_FAVORITES_PROPERTIES: {
      next(action);
      store.dispatch({
        type: SKELETON_ON,
        payload: {
          section: 'favorite',
          template: 'CardImageText',
        },
      });
      api.user.getFavoritesPages()
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_FAVORITES_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SKELETON_OFF });
        })
        .catch(() => {
          store.dispatch({ type: SKELETON_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkLead;
