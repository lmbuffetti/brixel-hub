import {
  SPINNER_ON,
  SPINNER_OFF,
  SEND_GENERIC_MAIL,
  SET_SAVED_SCREEN,
  SET_PSEUDO_SAVED_SCREEN,
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
      const { notification } = store.getState().common;
      notification.actions = [
        {
          type: 'primary',
          label: '',
          func: () => '',
          leftIcon: 'check',
          isLoading: null,
        }
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
          }
        })
      }, 1500)
      break;
    }
    case SET_PSEUDO_SAVED_SCREEN: {
      next(action);
      const notification = ({
        state: false,
        type: 'saved',
      });
      store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: notification });
      setTimeout(() => {
        store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: null })
      }, 1000)
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
