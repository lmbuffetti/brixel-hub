import Cookies from 'universal-cookie';
import queryString from 'query-string';
import {
  CHECK_TOKEN,
  CREATE_USER,
  DO_LOGOUT,
  GET_TOKEN,
  RECOVER_PASSWORD,
  SET_USER,
  VALIDATE_USER,

} from '../actions/types/UserTypes';

import {
  REQUEST_DONE,
  SPINNER_ON,
  SPINNER_OFF,
  ERROR_MESSAGE,
  SET_NOTIFICATION,
  SET_PAGE_DATA,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

import { setToken } from '../utils/helpers';

import baseByData from '@brixel/brixel-configuration-partner/src/Settings'
import { ADD_PROPERTY } from '../actions/types/PropertyTypes';

const cookies = new Cookies();

const checkUser = (store) => (next) => (action) => {
  switch (action.type) {
    case CHECK_TOKEN: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.user.validateToken(action.payload)
        .then((response) => {
          store.dispatch({ type: SET_USER, payload: response.data });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case GET_TOKEN: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const data = action.payload.user;
      const addProperty = action.payload.addProperty || false;
      delete action.payload.user;
      delete action.payload.addProperty;
      api.user.getToken(data, {rememberMe: true})
        .then((res) => {
          console.log(res, res.data.token);
          if (typeof res.data.statusCode === 'undefined') {
            setToken('brixelToken', res.data.token);
            if (addProperty) {
              store.dispatch({ type: ADD_PROPERTY, payload: data })
            }
          } else {
            const alertProps = {
              icon: 'close-circle',
              label: 'Email and password combination are invalid.',
              type: 'alert',
              actions: [{
                type: 'close',
                func: () => store.dispatch({ type: SET_NOTIFICATION, payload: null }),
              }],
            };
            store.dispatch({ type: SET_NOTIFICATION, payload: alertProps });
          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case CREATE_USER: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      console.log(action.payload);
      const data = action.payload.user;
      const addProperty = action.payload.addProperty || false;
      delete action.payload.user;
      delete action.payload.addProperty;
      api.user.createUser(action.payload)
        .then((res) => {
          if (typeof res.data.statusCode === 'undefined') {
            setToken('brixelToken', res.data.token);
            store.dispatch({ type: SET_USER, payload: res.data });
            if (addProperty) {
              store.dispatch({ type: ADD_PROPERTY, payload: data })
            }
          }
        });
      break;
    }
    case VALIDATE_USER: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const newUser = action.payload.user.createUser || false;
      delete action.payload.user.createUser;
      api.user.validateUser(action.payload.user.email)
        .then((res) => {
          console.log(res.data);
          if (newUser && typeof res.data.statusCode === 'undefined') {
            store.dispatch({ type: SET_PAGE_DATA, payload: 'loginPage' });
          } else if (newUser) {
            store.dispatch({ type: CREATE_USER, payload: action.payload });
          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkUser;
