import {
  SPINNER_ON,
  SPINNER_OFF,
  SEND_GENERIC_MAIL,
  SET_SAVED_SCREEN,
  SET_SCREEN_NOTIFICATION,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case SEND_GENERIC_MAIL: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.common.sendGenericMessage(action.payload)
        .then((res) => {
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch((res) => {
          // console.log(res.data);
        });
      break;
    }
    case SET_SAVED_SCREEN: {
      next(action);
      const notification = ({
        state: true,
        type: 'saved',
      });
      store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: notification });
      setTimeout(() => {
        store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: null })
      }, 3000)
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
