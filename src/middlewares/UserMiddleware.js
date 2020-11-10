import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import baseByData from '@brixel/brixel-configuration-partner/src/Settings';
import { change } from '@brixel/brixel-components';
import { user } from '../resources/localData/user';
import {
  CHECK_TOKEN,
  CREATE_USER,
  DO_LOGIN,
  SET_LOGGED_IN_USER,
  SAVE_ACTIVE_SINGLE_USER,
  VALIDATE_USER,
  GET_USER_PROPERTIES,
  SET_USER_PROPERTIES,
  GET_FAVORITES,
  SET_FAVORITES,
  GET_USER_PAGES_DEALS,
  SET_USER_PAGES_DEALS,
} from '../actions/types/UserTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
  SPINNER_SMALL_ON,
  SPINNER_SMALL_OFF,
  REDIRECT_TO,
  SET_FORM_ERROR,
} from '../actions/types/CommonTypes';

import { CREATE_ACTIVE_SINGLE_PROPERTY } from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';

import { setCookie, removeCookie } from '../utils/helpers';

const checkUser = (store) => (next) => (action) => {
  switch (action.type) {
    // DISPATCH TO VERIFY THE USER TOKEN
    case CHECK_TOKEN: {
      next(action);
      const hideLoad = get(action, 'payload.hideLoad', false);
      delete action.payload.hideLoad;
      store.dispatch({ type: SPINNER_ON });
      let data = hideLoad ? undefined : action.payload;
      if (data) data = Object.keys(data).length > 0 ? data : undefined;
      api.user.validateToken(data)
        .then((response) => {
          if (response.data && response.data.statusCode && response.data.statusCode === 401 && window.location.hostname.includes('localhost')) {
            removeCookie('brixelToken');
            window.location.href = '/tokeninput';
          } else if (response.data && response.data.statusCode && response.data.statusCode === 401) {
            window.location.href = `${baseByData.loginUrl}?url=${window.location.href}`;
          } else {
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: response.data });
          }
          if (!hideLoad) store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
          if (window.location.href.includes('localhost')) {
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: user });
          }
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO DO THE USER LOGIN - username - password
    case DO_LOGIN: {
      next(action);
      // store.dispatch({ type: SPINNER_ON });
      const data = action.payload.user;
      const addProperty = action.payload.addProperty || false;
      delete action.payload.user;
      delete action.payload.addProperty;
      api.user.getToken(data, { rememberMe: true })
        .then((res) => {
          if (typeof res.data.statusCode === 'undefined') {
            setCookie('brixelToken', res.data.token);
            if (addProperty) {
              const dataProperty = action.payload;
              dataProperty.token = res.data.token;
              dataProperty.owner = res.data.user.id;
              store.dispatch({ type: CREATE_ACTIVE_SINGLE_PROPERTY, payload: dataProperty });
            }
          } else {
            const alertProps = {
              message: 'Email and password combination are invalid.',
              state: true,
            };
            store.dispatch({ type: SET_FORM_ERROR, payload: alertProps });
          }
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO CREATE USER - USER OBJECT
    case CREATE_USER: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const data = action.payload.user;
      const addProperty = action.payload.addProperty || false;
      const { redirectTo, setOwner } = action.payload.user;
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
            if (setOwner) {
              store.dispatch(change('GetStarted', 'owner', userData.user.id));
            }
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: userData });
            if (redirectTo) {
              store.dispatch({ type: REDIRECT_TO, payload: { history: redirectTo } });
            }
            if (addProperty) {
              const dataProperty = cloneDeep(action.payload);
              dataProperty.token = userData.token;
              dataProperty.owner = userData.user.id;
              store.dispatch({ type: CREATE_ACTIVE_SINGLE_PROPERTY, payload: dataProperty });
            }
            store.dispatch({ type: SPINNER_OFF });
          } else if (res.data.statusCode === 400 && res.data.errorMessage === 'Email is invalid!') {
            const alertProps = {
              message: 'Please use a valid e-mail address',
              state: true,
              noRedirect: true,
            };
            store.dispatch({ type: SET_FORM_ERROR, payload: alertProps });
            store.dispatch({ type: SPINNER_OFF });
          }
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO UPDATE USER - USER OBJECT
    case SAVE_ACTIVE_SINGLE_USER: {
      next(action);
      const objData = cloneDeep(action.payload);
      const { id } = action.payload;
      const { sendEmail, setLoggedInUser, smallLoader } = action.payload;
      delete objData.id;
      delete objData.sendEmail;
      delete objData.smallLoader;
      delete objData.setLoggedInUser;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL_ON, payload: 'userData' });
      else store.dispatch({ type: SPINNER_ON });
      api.user.updateUser(id, objData)
        .then((response) => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL_OFF });
          else store.dispatch({ type: SPINNER_OFF });
          if (sendEmail) {
            api.common.sendGenericMessage(sendEmail)
              .then(() => {
                // console.log(res.data);
              });
          }
          if (setLoggedInUser) {
            const userData = store.getState().user.loggedInUser;
            userData.user = response.data;
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: userData });
          }
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // GET USER PAGES BY DEALS
    case GET_USER_PAGES_DEALS: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.user.getPagesByDealByUser(action.payload)
        .then((res) => {
          const pageList = [];
          // eslint-disable-next-line no-return-assign
          res.data.forEach((item) => {
            pageList.push({ ...item.page, dealID: item.id, archivedByBuyer: item.archivedByBuyer || false });
          });
          store.dispatch({ type: SET_USER_PAGES_DEALS, payload: pageList });
          store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO VALIDATE IF USER EXISTS
    case VALIDATE_USER: {
      next(action);
      // store.dispatch({ type: SPINNER_ON });
      const newUser = action.payload.user.createUser || false;
      delete action.payload.user.createUser;
      api.user.validateUser(action.payload.user.email)
        .then((res) => {
          if (newUser && typeof res.data.statusCode === 'undefined') {
            const alertProps = {
              message: 'You already have a profile, please do a login',
              state: true,
            };
            store.dispatch({ type: SET_FORM_ERROR, payload: alertProps });
          } else if (newUser) {
            store.dispatch({ type: CREATE_USER, payload: action.payload });
          }
          // store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO GET FAVORITES LIST
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
    // DISPATCH TO GET FAVORITES LIST
    case GET_USER_PROPERTIES: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL_ON, payload: 'usrProperties' });
      api.user.getPropertiesOfUser(action.payload)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_USER_PROPERTIES, payload: res.data || {} });
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

export default checkUser;
