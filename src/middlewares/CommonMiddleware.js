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
      let notification = cloneDeep(get(store.getState(), 'common.notification', []));
      const errorExist = notification.filter((item) => item.type === action.payload.type && item.label === action.payload.label);
      let delaySetState = 0;
      if (action.payload.type === 'resetAll') {
        notification = [];
      } else if (errorExist.length === 0 && action.payload.state) {
        if (action.payload.type === 'save') notification = [action.payload];
        else notification.push(action.payload);
      } else if (action.payload.type === 'save') {
        const getIndex = notification.findIndex((item) => item.type === action.payload.type);
        if (action.payload.action !== notification[getIndex].action) {
          notification[getIndex].action = action.payload.action;
        } else {
          notification.splice(getIndex, 1);
          delaySetState = 2000;
        }
      } else if (!action.payload.state) {
        const getIndex = notification.findIndex((item) => item.type === action.payload.type && item.label === action.payload.label);
        const getIndexSaveData = notification.findIndex((item) => item.action === 'saveData');
        notification[getIndex].state = action.payload.state;
        if (notification[getIndexSaveData]) {
          delete notification[getIndexSaveData].action;
        }
        store.dispatch({ type: SET_NOTIFICATION, payload: cloneDeep(notification) });
        delaySetState = 2000;
        notification.splice(getIndex, 1);
      }
      setTimeout(() => {
        store.dispatch({ type: SET_NOTIFICATION, payload: notification });
      }, delaySetState);
      break;
    }
    default:
      next(action);
  }
};

export default checkCommon;
