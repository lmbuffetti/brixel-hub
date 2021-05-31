import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import {
  SPINNER_ON,
  SPINNER_OFF,
  SEND_GENERIC_MAIL,
  SET_SAVED_SCREEN,
  SET_NOTIFICATION,
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
    // DISPATCH NOTIFICATION
    case SET_SCREEN_NOTIFICATION: {
      next(action);
      const notification = cloneDeep(get(store.getState(), 'common.notification', []));
      const errorExist = notification.filter((item) => item.type === action.payload.type && item.label === action.payload.label);
      if (action.payload.type === 'resetAll') {
        store.dispatch({ type: SET_NOTIFICATION, payload: [] });
      } else if (errorExist.length === 0 && action.payload.state) {
        notification.push(action.payload);
        store.dispatch({ type: SET_NOTIFICATION, payload: notification });
      } else if (action.payload.type === 'save') {
        const getIndex = notification.findIndex((item) => item.type === action.payload.type);
        if (action.payload.action !== notification[getIndex].action) {
          notification[getIndex].action = action.payload.action;
        } else {
          notification.splice(getIndex, 1);
        }
        store.dispatch({ type: SET_NOTIFICATION, payload: notification });
      } else if (!action.payload.state) {
        const getIndex = notification.findIndex((item) => item.type === action.payload.type && item.label === action.payload.label);
        const getIndexSaveData = notification.findIndex((item) => item.action === 'saveData');
        notification.splice(getIndex, 1);
        if (notification[getIndexSaveData]) delete notification[getIndexSaveData].action;
        store.dispatch({ type: SET_NOTIFICATION, payload: notification });
      }
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
