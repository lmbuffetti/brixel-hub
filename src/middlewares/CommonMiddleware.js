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
    // DISPATCH TO SEND GENERAL EMAIL
    case SEND_GENERIC_MAIL: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.common.sendGenericMessage(action.payload)
        .then(() => {
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
          // console.log(res.data);
        });
      break;
    }
    // DISPATCH TO SHOW NOTIFICATION SAVED
    case SET_SAVED_SCREEN: {
      next(action);
      const { notification } = store.getState().common;
      notification.actions = [
        {
          type: 'primary',
          label: '',
          func: () => '',
          leftIcon: 'check',
          isLoading: null,
        },
      ];
      notification.label = 'Saved!';
      notification.className = 'saved';
      setTimeout(() => {
        store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: notification });
      }, 100);
      setTimeout(() => {
        store.dispatch({
          type: SET_SCREEN_NOTIFICATION,
          payload: {
            ...notification,
            state: false,
          },
        });
      }, 1500);
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
