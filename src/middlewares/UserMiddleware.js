import get from 'lodash/get';
import user from '../resources/localData/user.json';
import {
  CHECK_TOKEN,
  CREATE_USER,
  DO_LOGIN,
  SET_LOGGED_IN_USER,
  SAVE_ACTIVE_SINGLE_USER,
  VALIDATE_USER,
  GET_USER_PROPERTIES,
  SET_USER_PROPERTIES,
  GET_FAVORITES, SET_FAVORITES,
} from '../actions/types/UserTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL_ON,
  SPINNER_SMALL_OFF,
  SET_SCREEN_NOTIFICATION,
  SET_PAGE_DATA, REDIRECT_TO,
} from '../actions/types/CommonTypes';

import { CREATE_ACTIVE_SINGLE_PROPERTY } from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';

import { setCookie, removeCookie } from '../utils/helpers';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';

const checkUser = (store) => (next) => (action) => {
  switch (action.type) {
    case CHECK_TOKEN: {
      next(action);
      const hideLoad = get(action, 'payload.hideLoad', false);
      delete action.payload.hideLoad;
      store.dispatch({ type: SPINNER_ON });
      let data = hideLoad ? undefined : action.payload;
      console.log(data);
      if (data) data = Object.keys(data).length > 0 ? data : undefined;
      api.user.validateToken(data)
        .then((response) => {
          if (response.data && response.data.statusCode && response.data.statusCode === 401 && window.location.hostname.includes('localhost')) {
            removeCookie('brixelToken');
            window.location.href = `/tokeninput`;
          } else if (response.data && response.data.statusCode && response.data.statusCode === 401) {
            window.location.href = `${baseByData.loginUrl}?url=${window.location.href}`;
          } else {
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: response.data });
          }
          if (!hideLoad) store.dispatch({ type: SPINNER_OFF });
        })
        .catch((error) => {
          console.log(error);
          if (window.location.href.includes('localhost')) {
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: user });
          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case DO_LOGIN: {
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
              store.dispatch({ type: CREATE_ACTIVE_SINGLE_PROPERTY, payload: dataProperty })
            }
          } else {
            const alertProps = {
              icon: 'close-circle',
              label: 'Email and password combination are invalid.',
              type: 'alert',
              actions: [{
                type: 'close',
                func: () => store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: null }),
              }],
            };
            store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: alertProps });
          }
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
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
      api.user.createUser(data)
        .then((res) => {
          if (typeof res.data.statusCode === 'undefined') {
            setCookie('brixelToken', res.data.token);
            let userData;
            if (res.data.user) userData = res.data;
            else {
              userData = {};
              userData.user = res.data;
              userData.token = res.data.token;
            }
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: userData });
            if (redirectTo) store.dispatch({ type: REDIRECT_TO, payload: { history: redirectTo } });
            if (addProperty) {
              const dataProperty = action.payload;
              dataProperty.token = userData.token;
              dataProperty.owner = userData.user.id;
              store.dispatch({ type: CREATE_ACTIVE_SINGLE_PROPERTY, payload: dataProperty })
            }
            store.dispatch({ type: SPINNER_OFF });
          }
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case SAVE_ACTIVE_SINGLE_USER: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const { id } = action.payload;
      const { sendEmail } = action.payload;
      delete action.payload.id;
      delete action.payload.sendEmail;
      api.user.updateUser(id, action.payload)
        .then(() => {
          store.dispatch({ type: SPINNER_OFF });
          if (sendEmail) {
            api.common.sendGenericMessage(sendEmail)
              .then(() => {
                // console.log(res.data);
              })
          }
        })
        .catch(() => {
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
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    case GET_FAVORITES: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON, payload: 'favorite' });
      api.user.getFavoritesPages()
        .then((res) => {
          store.dispatch({ type: SET_FAVORITES, payload: res.data });
          store.dispatch({ type: SPINNER_SMALL_OFF });
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_SMALL_OFF });
        });
      break;
    }
    case GET_USER_PROPERTIES: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON, payload: 'usrProperties' });
      api.user.getPropertiesOfUser(action.payload)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_USER_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SPINNER_SMALL_OFF });
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

export default checkUser;
