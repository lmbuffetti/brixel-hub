import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import {change} from '@brixel-io/brixel-components/dist/form';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import {
  REDIRECT_TO,
  SET_FORM_ERROR,
  SET_LANGUAGE,
  SET_SCREEN_NOTIFICATION,
  SPINNER_OFF,
  SPINNER_ON,
  SPINNER_SMALL,
} from '../actions/types/CommonTypes';

import {CREATE_ESTIMATION} from '../actions/types/EstimationTypes';
import {GET_BUYER_PROPERTIES, GET_WISHLIST_PROPERTIES, SET_FAVORITES_PROPERTIES} from '../actions/types/MarketTypes';

import {CREATE_ACTIVE_SINGLE_PROPERTY} from '../actions/types/PropertyTypes';

import {CREATE_USER_SEARCH_PROFILE} from '../actions/types/SearchProfileTypes';
import {
  ADD_NOT_INTERESTED,
  CHECK_TOKEN,
  CREATE_USER,
  DO_LOGIN,
  GET_USER_PROPERTIES,
  RECOVER_PASSWORD,
  REMOVE_NOT_INTERESTED,
  SAVE_ACTIVE_SINGLE_USER,
  SEND_USER_SCAN_TRIAL,
  SET_LOGGED_IN_USER,
  SET_USER_PROPERTIES, SET_USER_RATE,
  UPDATE_FAVORITE,
  VALIDATE_USER,
} from '../actions/types/UserTypes';

import api from '../controllers/api/config';

import {removeCookie, setCookie} from '../utils/helpers';
import translateTo from '../utils/translation';

const checkUser = (store) => (next) => (action) => {
  switch (action.type) {
    // DISPATCH TO VERIFY THE USER TOKEN
    case CHECK_TOKEN: {
      next(action);
      const hideLoad = get(action, 'payload.hideLoad', false);
      delete action.payload.hideLoad;
      if (!hideLoad) store.dispatch({ type: SPINNER_ON });
      let data = hideLoad ? undefined : action.payload;
      if (data) data = Object.keys(data).length > 0 ? data : undefined;
      api.user.validateToken(data)
        .then((response) => {
          if (response.data.valid === true) {
            api.user.getUserByToken(data)
              .then((res) => {
                api.user.getUser(res.data.id)
                  .then((res2) => {
                    if (get(res2, 'data.user.language', '').includes('en')) res2.data.language = 'en';
                    store.dispatch({ type: SET_LOGGED_IN_USER, payload: {user: res2.data} });
                    if (!hideLoad) store.dispatch({ type: SPINNER_OFF });
                    api.user.getUserRate(res2.data.id)
                      .then((res3) => {
                        store.dispatch({ type: SET_USER_RATE, payload: res3.data });
                      })
                  });
              });
            store.dispatch({ type: SPINNER_OFF });
          } else {
            if ((get(window, 'location.hostname', '').includes('localhost') || get(window, 'location.hostname', '').includes('192.168'))) {
              removeCookie('brixelToken');
              window.location.assign('/tokeninput');
            } else window.location.assign(`${baseByData?.logoutUrl}?url=${get(window, 'location.href', '')}`);
            if (!hideLoad) store.dispatch({ type: SPINNER_OFF });
          }
        })
        .catch(() => {
          if (get(window, 'location.href', '').includes('localhost')) {
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: {} });
          }
          if ((get(window, 'location.hostname', '').includes('localhost') || get(window, 'location.hostname', '').includes('192.168'))) {
            removeCookie('brixelToken');
            window.location.assign('/tokeninput');
          } else window.location.assign(`${baseByData?.logoutUrl}?url=${get(window, 'location.href', '')}`);
          if (!hideLoad) store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO DO THE USER LOGIN - username - password
    case DO_LOGIN: {
      next(action);
      const {
        forceRedirect,
        redirectTo,
      } = action.payload;
      const data = action.payload.user;
      const addProperty = action.payload.addProperty || false;
      const addSearchProfile = action.payload.addSearchProfile || false;
      const createEstimation = action.payload.createEstimation || false;
      delete action.payload.user;
      delete action.payload.addProperty;
      delete action.payload.redirectTo;
      delete action.payload.forceRedirect;
      api.user.getToken(data, { rememberMe: true })
        .then((res) => {
          if (typeof res.data.statusCode === 'undefined') {
            api.user.getUserByToken(res.data.token)
              .then((res1) => {
                store.dispatch({ type: SET_LOGGED_IN_USER, payload: res.data });
                setCookie('brixelToken', res.data.token);
                if (addProperty) {
                  const dataProperty = action.payload;
                  dataProperty.token = res.data.token;
                  dataProperty.owner = res1.data.id;
                  store.dispatch({ type: CREATE_ACTIVE_SINGLE_PROPERTY, payload: dataProperty });
                } else if (addSearchProfile) {
                  const dataProfile = action.payload;
                  dataProfile.token = res.data.token;
                  dataProfile.dataSearchProfile.user = res1.data.id;
                  store.dispatch({ type: CREATE_USER_SEARCH_PROFILE, payload: dataProfile });
                } else if (redirectTo) {
                  store.dispatch({ type: REDIRECT_TO, payload: { history: redirectTo } });
                } else if (forceRedirect) {
                  window.location.href = forceRedirect
                } else if (createEstimation) {
                  const dataProperty = action.payload;
                  dataProperty.token = res.data.token;
                  dataProperty.owner = res1.data.id;
                  store.dispatch({ type: CREATE_ESTIMATION, payload: dataProperty });
                }
              });
          } else {
            const alertProps = {
              message: 'Email and password combination are invalid.',
              state: true,
            };
            store.dispatch({ type: SET_FORM_ERROR, payload: alertProps });
          }
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch((err) => {
          const getError = err?.meta?.statusText?.response?.data;
          if (getError) {
            const alertProps = {
              message: getError.errorMessage,
              state: true,
            };
            store.dispatch({type: SET_FORM_ERROR, payload: alertProps});
          }
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
      const addSearchProfile = action.payload.addSearchProfile || false;
      const extraLoading = action.payload.user.extraLoading || false;
      const createEstimation = action.payload.createEstimation || false;
      const { redirectTo, setOwner, forceRedirect } = action.payload.user;
      delete action.payload.user;
      delete action.payload.addProperty;
      delete action.payload.createEstimation;
      delete data.redirectTo;
      delete data.forceRedirect;
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
            if (get(userData, 'user.language', '').includes('en')) userData.user.language = 'en';
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: userData });
            if (addProperty) {
              const dataProperty = cloneDeep(action.payload);
              dataProperty.token = userData.token;
              dataProperty.owner = userData.user.id;
              store.dispatch({ type: CREATE_ACTIVE_SINGLE_PROPERTY, payload: dataProperty });
            } else if (addSearchProfile) {
              const dataProfile = action.payload;
              dataProfile.token = res.data.token;
              dataProfile.dataSearchProfile.user = userData.user.id;
              store.dispatch({ type: CREATE_USER_SEARCH_PROFILE, payload: dataProfile });
            } else if (createEstimation) {
              const dataProperty = action.payload;
              dataProperty.token = userData.token;
              dataProperty.owner = userData.user.id;
              store.dispatch({ type: CREATE_ESTIMATION, payload: dataProperty });
            }
            if (redirectTo) {
              store.dispatch({ type: REDIRECT_TO, payload: { history: redirectTo } });
            }
            if (forceRedirect) {
              window.location.href = forceRedirect
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
            if (extraLoading) store.dispatch({ type: SPINNER_OFF });
          }
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
          if (extraLoading) store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // RESET PASSWORD
    case RECOVER_PASSWORD: {
      next(action);
      const {
        email,
        smallLoader,
      } = action.payload;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: true } });
      else store.dispatch({ type: SPINNER_ON });
      api.user.recoverPassword(email)
        .then(() => {
          const feedbackMessage = 'If you have an account with us, check your mailbox for the new password!';
          const alertProps = {
            label: feedbackMessage,
            state: true,
            type: 'done',
          };
          store.dispatch({ type: SET_SCREEN_NOTIFICATION, payload: alertProps });
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: false } });
          else store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO UPDATE USER - USER OBJECT
    case SAVE_ACTIVE_SINGLE_USER: {
      next(action);
      const objData = cloneDeep(action.payload);
      const { id } = action.payload;
      const { setLoggedInUser, smallLoader } = action.payload;
      delete objData.id;
      delete objData.smallLoader;
      delete objData.setLoggedInUser;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: true } });
      else store.dispatch({ type: SPINNER_ON });
      api.user.updateUser(id, objData)
        .then((response) => {
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: false } });
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { sentData: true } });
          else store.dispatch({ type: SPINNER_OFF });
          if (setLoggedInUser) {
            const userData = store.getState().user.loggedInUser;
            userData.user = response.data;
            if (get(userData, 'user.language', '').includes('en')) userData.user.language = 'en';
            store.dispatch({ type: SET_LOGGED_IN_USER, payload: userData });
            store.dispatch({ type: SET_LANGUAGE, payload: userData.user.language });
          }
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // GET USER PROPERTIES AS SELLER
    case GET_USER_PROPERTIES: {
      next(action);
      store.dispatch({ type: SPINNER_SMALL, payload: { usrProperties: true } });
      api.user.getPropertiesOfUser(action.payload, 50)
        .then((res) => {
          if (res.meta.status === 200) {
            store.dispatch({ type: SET_USER_PROPERTIES, payload: res.data });
          }
          store.dispatch({ type: SPINNER_SMALL, payload: { usrProperties: false } });
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch(() => {
          store.dispatch({ type: SPINNER_SMALL, payload: { usrProperties: false } });
        });
      break;
    }
    // DISPATCH TO VALIDATE IF USER EXISTS
    case VALIDATE_USER: {
      next(action);
      // store.dispatch({ type: SPINNER_ON });
      const newUser = action.payload.user.createUser || false;
      const extraLoading = action.payload.user.extraLoading || false;
      delete action.payload.user.createUser;
      store.dispatch({ type: SPINNER_ON });
      api.user.validateUser(action.payload.user.email)
        .then((res) => {
          if (newUser && res.meta.status === 200) {
            const alertProps = {
              message: 'You already have a profile, please do a login',
              state: true,
            };
            store.dispatch({ type: SET_FORM_ERROR, payload: alertProps });
            store.dispatch({ type: SPINNER_OFF });
          } else if (newUser && res.meta.status === 404) {
            store.dispatch({ type: CREATE_USER, payload: action.payload });
          } else {
            const alertProps = {
              message: 'Please insert a valid email address',
              noRedirect: true,
              state: true,
            };
            store.dispatch({ type: SET_FORM_ERROR, payload: alertProps });
            store.dispatch({ type: SPINNER_OFF });
          }
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch((err) => {
          const statusCode = get(err, 'meta.statusText.response.data.statusCode', null);
          if (statusCode === 404) {
            store.dispatch({ type: CREATE_USER, payload: action.payload });
          } else {
            const alertProps = {
              message: 'Please insert a valid email address',
              state: true,
            };
            store.dispatch({ type: SET_FORM_ERROR, payload: alertProps });
            store.dispatch({ type: SPINNER_OFF });
          }
          store.dispatch({ type: SPINNER_OFF });
          if (extraLoading) store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    // DISPATCH TO UPDATE USER FAVORITE
    case UPDATE_FAVORITE: {
      next(action);
      const {
        act,
        data,
        id,
        property,
        reloadProperties,
      } = action.payload;
      store.dispatch({ type: SPINNER_SMALL, payload: { [`favorite-${id}`]: true } });
      const favoritesData = cloneDeep(get(store.getState(), 'market.wishlistProperties', {}));
      const favoritesList = favoritesData.data;
      const lang = get(store.getState(), 'common.language', 'en');
      if (act === 'add') {
        api.user.addFavorite(id, data)
          .then(() => {
            if (favoritesList && property) {
              favoritesList.unshift(property);
              store.dispatch({ type: SET_FAVORITES_PROPERTIES, payload: favoritesData });
            }
            if (reloadProperties) {
              store.dispatch({ type: GET_WISHLIST_PROPERTIES, payload: favoritesData });
            }
            // store.dispatch({ type: GET_FAVORITES_PROPERTIES, payload: favParams });
            store.dispatch({ type: SPINNER_SMALL, payload: { [`favorite-${id}`]: false } });
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                icon: 'favorite-fill',
                state: true,
                label: translateTo('Added to saved properties', lang),
                type: 'done',
              },
            })
          });
      } else {
        api.user.removeWishlist(id, data)
          .then(() => {
            if (favoritesList && property) {
              const findIndex = favoritesList.findIndex((fav) => fav.id === property.id);
              favoritesList.splice(findIndex, 1);
              store.dispatch({ type: SET_FAVORITES_PROPERTIES, payload: favoritesData });
            }
            if (reloadProperties) {
              store.dispatch({ type: GET_WISHLIST_PROPERTIES, payload: favoritesData });
            }
            store.dispatch({ type: SPINNER_SMALL, payload: { [`favorite-${id}`]: false } });
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                icon: 'favorite-fill',
                state: true,
                label: translateTo('Removed from saved properties', lang),
                type: 'done',
              },
            })
          });
      }
      break;
    }
    case ADD_NOT_INTERESTED: {
      next(action);
      const {
        id,
        reloadBuyerProperties,
      } = action.payload;
      store.dispatch({ type: SPINNER_SMALL, payload: { [`notInterested-${id}`]: true } });
      api.user.addAsNotInterested(id)
        .then(() => {
          if (reloadBuyerProperties) {
            const splitURL = get(window, 'location.href', '').split('/') || [];
            if (splitURL.length > 0) {
              const page = splitURL[splitURL.length - 1];
              const cat = splitURL[splitURL.length - 2].replace(/-/g, '');
              const searchProfileID = get(store.getState(), 'user.activeSearchProfile.id', null);
              const data = {
                offset: (+page - 1) * 9,
                limit: 9,
                searchProfileId: searchProfileID,
                type: cat,
              }
              store.dispatch({ type: GET_BUYER_PROPERTIES, payload: data });
            }
          }
          store.dispatch({ type: SPINNER_SMALL, payload: { [`notInterested-${id}`]: false } });
        });
      break;
    }
    case REMOVE_NOT_INTERESTED: {
      next(action);
      const id = action.payload;
      store.dispatch({ type: SPINNER_SMALL, payload: { [`notInterested-${id}`]: true } });
      api.user.removeAsNotInterested(id)
        .then(() => {
          store.dispatch({ type: SPINNER_SMALL, payload: { [`notInterested-${id}`]: false } });
        });
      break;
    }
    case SEND_USER_SCAN_TRIAL: {
      next(action);
      const {
        smallLoader,
        data,
      } = action.payload;
      if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: true } });
      else store.dispatch({ type: SPINNER_ON });
      api.user.userScanTrial(data)
        .then(() => {
          // console.log(res);
          // store.dispatch({ type: GET_FAVORITES_PROPERTIES, payload: favParams });
          if (smallLoader) store.dispatch({ type: SPINNER_SMALL, payload: { [smallLoader]: false } });
          else store.dispatch({ type: SPINNER_OFF });
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkUser;
