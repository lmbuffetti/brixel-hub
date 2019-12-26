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
} from '../actions/types/UserTypes';

import {
  REQUEST_DONE,
  SPINNER_ON,
  SPINNER_OFF,
  ERROR_MESSAGE,
  SET_NOTIFICATION,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

import { setToken } from '../utils/helpers';

import baseByData from '@brixel/brixel-configuration-partner/src/Settings'

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
    case DO_LOGOUT: {
      next(action);
      cookies.remove('brixelToken');
      const urlParams = queryString.parse(window.location.href.split('?')[1]);
      window.location.href = urlParams.url;
      break;
    }
    case GET_TOKEN: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.user.getToken(action.payload, {rememberMe: true})
        .then((res) => {
          console.log(res, res.data.token);
          if (typeof res.data.statusCode === 'undefined') {
            const redirectURl = localStorage.getItem('brixelRedirectUrl') || baseByData.dashboardPath;
            localStorage.removeItem('brixelRedirectUrl');
            localStorage.removeItem('brixelLoginChannel');
            setToken('brixelToken', res.data.token);
            window.location.href = redirectURl;
            // store.dispatch({ type: SET_USER, payload: res.data });
            store.dispatch({ type: ERROR_MESSAGE, payload: {}});
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
    case RECOVER_PASSWORD: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.user.recoverPassword(action.payload)
        .then((res) => {
          console.log(res);
          const successMsg = 'You\'ll receive a new password on your mailbox!';
          const errorMsg = 'That e-mail does not exist. Register here';
          if (typeof res.data.statusCode === 'undefined') {
            const alertProps = {
              icon: 'check-small',
              label: successMsg,
              type: 'success',
              actions: [{
                type: 'close',
                func: () => store.dispatch({ type: SET_NOTIFICATION, payload: null }),
              }],
            };
            store.dispatch({ type: SET_NOTIFICATION, payload: alertProps });
          } else {
            const alertProps = {
              icon: 'close-circle',
              label: errorMsg,
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
      api.user.createUser(action.payload)
        .then((res) => {
          console.log(res);
          if (typeof res.data.statusCode === 'undefined') {
            const redirectURl = localStorage.getItem('brixelRedirectUrl') || baseByData.dashboardPath;
            localStorage.removeItem('brixelRedirectUrl');
            localStorage.removeItem('brixelLoginChannel');
            setToken('brixelToken', res.data.token);
            window.location.href = redirectURl;
          }
        });
      break;
    }
    case UPDATE_USER: {
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const userID = store.getState().user.loggedUser.user.id;
      const formData = store.getState().form.UpdateForm.values;
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        language: formData.language,
        showPersonalInfo: formData.showPersonalInfo,
        showEmail: formData.showEmail,
        showPhoneNumber: formData.showPhoneNumber,
        avatar: formData.avatar.id,
      };
      if (formData.password) data.password = formData.password;
      if (formData.confirmPassword) data.confirmPassword = formData.confirmPassword;
      if ((formData.password || formData.confirmPassword) && formData.password !== formData.confirmPassword) {
        const alertProps = {
          icon: 'close-circle',
          label: 'Password confirmation doesn\'t match password',
          type: 'alert',
          actions: [{
            type: 'close',
            func: () => store.dispatch({ type: SET_NOTIFICATION, payload: null }),
          }],
        };
        store.dispatch({ type: SET_NOTIFICATION, payload: alertProps });
        store.dispatch({ type: SPINNER_OFF });
      } else {
        api.user.updateUser(userID, data)
          .then((res) => {
            console.log(res);
            store.dispatch({ type: SET_NOTIFICATION, payload: null });
            store.dispatch({ type: SPINNER_OFF });
          })
      }
      break;
    }
    default:
      next(action);
  }
};

export default checkUser;
