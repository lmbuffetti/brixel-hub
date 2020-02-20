import Cookies from 'universal-cookie';
import queryString from 'query-string';
import {
  CHECK_TOKEN,
  CREATE_USER,
  DO_LOGOUT,
  GET_TOKEN,
  RECOVER_PASSWORD,
  SET_USER,
  UPDATE_USER,
  VALIDATE_USER,
  GET_USER_PAGE,
  SET_USER_PAGE,
} from '../actions/types/UserTypes';

import {
  REQUEST_DONE,
  SPINNER_ON,
  SPINNER_OFF,
  ERROR_MESSAGE,
  SET_NOTIFICATION,
  SET_PAGE_DATA, REDIRECT_TO,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

import { setCookie } from '../utils/helpers';

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
        })
        .catch((res) => {
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
          if (typeof res.data.statusCode === 'undefined') {
            setCookie('brixelToken', res.data.token);
            if (addProperty) {
              const dataProperty = action.payload;
              dataProperty.token = res.data.token;
              dataProperty.owner = res.data.user.id;
              store.dispatch({ type: ADD_PROPERTY, payload: dataProperty })
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
        })
        .catch((res) => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case CREATE_USER: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const data = action.payload.user;
      const addProperty = action.payload.addProperty || false;
      const { redirectTo } = action.payload.user;
      delete action.payload.user;
      delete action.payload.addProperty;
      // delete action.payload.user.redirectTo;
      api.user.createUser(data)
        .then((res) => {
          if (typeof res.data.statusCode === 'undefined') {
            setCookie('brixelToken', res.data.token);
            let userData = res.data;
            if (res.data.user) userData = res.data;
            else {
              userData = {};
              userData.user = res.data;
              userData.token = res.data.token;
            }
            store.dispatch({ type: SET_USER, payload: userData });
            if (redirectTo) store.dispatch({ type: REDIRECT_TO, payload: { history: redirectTo } });
            if (addProperty) {
              const dataProperty = action.payload;
              dataProperty.token = userData.token;
              dataProperty.owner = userData.user.id;
              store.dispatch({ type: ADD_PROPERTY, payload: dataProperty })
            }
            store.dispatch({ type: SPINNER_OFF });
          }
        })
        .catch((res) => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case UPDATE_USER: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const { id } = action.payload;
      const { sendEmail } = action.payload;
      delete action.payload.id;
      delete action.payload.sendEmail;
      api.user.updateUser(id, action.payload)
        .then((res) => {
          store.dispatch({ type: SPINNER_OFF });
          if (sendEmail) {
            api.common.sendGenericMessage(sendEmail)
              .then((res) => {
                // console.log(res.data);
              })
          }
        })
        .catch((res) => {
          store.dispatch({ type: SPINNER_OFF });
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
          if (newUser && typeof res.data.statusCode === 'undefined') {
            store.dispatch({
              type: SET_PAGE_DATA,
              payload: {
                login: {
                  view: true,
                  message: 'You already have a profile, please do a login'
                }
              }
            });
          } else if (newUser) {
            store.dispatch({ type: CREATE_USER, payload: action.payload });
          }
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch((res) => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case GET_USER_PAGE: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.user.getUserPage(action.payload.id)
        .then((res) => {
          console.log(res.data);
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkUser;
