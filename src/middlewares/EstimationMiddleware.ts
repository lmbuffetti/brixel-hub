import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import has from 'lodash/has';
import set from 'lodash/set';

import {SET_SCREEN_NOTIFICATION, SPINNER_OFF, SPINNER_ON, SPINNER_SMALL} from '../actions/types/CommonTypes';
import {
  CREATE_ESTIMATION,
  DELETE_ESTIMATION,
  GENERATE_ESTIMATION,
  SEND_PROESTIMATION_NOTIFICATION,
} from '../actions/types/EstimationTypes';

import {SET_ESTIMATION} from '../actions/types/PropertyTypes';

import {SAVE_ACTIVE_SINGLE_USER} from '../actions/types/UserTypes';

import {GET_OWNED_ESTIMATIONS, SET_OWNED_PROPERTIES} from '../actions/types/MarketTypes';


import api from '../controllers/api/config';

const checkEstimation = (store) => (next) => (action) => {
  switch (action.type) {
    case CREATE_ESTIMATION: {
      next(action);
      const {
        generate, redirectTo, smallLoader, termsBaloiseBank, termsBaloiseInsurance, termsUBS,
      } = action.payload;
      let dataToSend = cloneDeep(action.payload);
      const token = get(action, 'payload.token', null);
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      } else {
        store.dispatch({
          type: SPINNER_ON,
        });
      }
      if (has(action, 'payload.data')) {
        dataToSend = {
          data: action.payload.data,
          owner: action.payload.owner,
          generate,
          redirectTo,
        };
      }
      delete dataToSend.generate;
      delete dataToSend.smallLoader;
      delete dataToSend.token;
      delete action.payload.termsBaloiseBank;
      delete action.payload.termsBaloiseInsurance;
      delete action.payload.termsUBS;
      api.estimation.createEstimation(dataToSend, token)
        .then((response) => {
          if (response.meta.normalizedStatus === 200) {
            if (termsBaloiseBank || termsBaloiseInsurance) {
              const data = {
                id: dataToSend.owner,
                termsBaloiseBank: true,
                termsBaloiseInsurance: true,
              }
              store.dispatch({
                type: SAVE_ACTIVE_SINGLE_USER,
                payload: data,
              });
            }
            if (termsUBS) {
              const data = {
                id: dataToSend.owner,
                termsUBS: true,
              }
              store.dispatch({
                type: SAVE_ACTIVE_SINGLE_USER,
                payload: data,
              });
            }

            if (generate === true) {
              store.dispatch({
                type: GENERATE_ESTIMATION,
                payload: {
                  id: response.data.id,
                  page: action.payload.page,
                  token,
                  redirectTo,
                  reloadOnwProperties: get(dataToSend, 'reloadOnwProperties', false),
                },
              });
            } else if (redirectTo) {
              store.dispatch({
                type: SET_SCREEN_NOTIFICATION,
                payload: {
                  state: true,
                  type: 'done',
                },
              });
              window.location.assign(redirectTo);
            }
          } else {
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: response.data.errorMessage,
                type: 'alert',
              },
            });
          }
          store.dispatch({
            type: SET_ESTIMATION,
            payload: response.data,
          });
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case GENERATE_ESTIMATION: {
      next(action);
      const {
        page, redirectTo, smallLoader,
      } = action.payload;
      if (smallLoader) {
        store.dispatch({
          type: SPINNER_SMALL,
          payload: {
            [smallLoader]: true,
          },
        });
      } else {
        store.dispatch({
          type: SPINNER_ON,
        });
      }
      const token = get(action, 'payload.token', null);
      if (get(action, 'payload.token', null)) delete action.payload.token;
      api.estimation.generateEstimation(action.payload.id || action.payload, token)
        .then((response) => {
          if (response.meta.normalizedStatus === 200) {
            store.dispatch({
              type: SET_ESTIMATION,
              payload: response.data,
            });
            set(store.getState().property.activeSingleProperty, 'estimation', response.data);
            if (get(action.payload, 'reloadOnwProperties', false)) {
              const proList = get(store.getState(), 'market.ownerProperties', {});
              const findProp = proList.data.findIndex((prop) => prop.id === page);
              set(proList.data[findProp], 'estimation', response.data);
              store.dispatch({ type: SET_OWNED_PROPERTIES, payload: proList });
            }
            if (redirectTo) {
              store.dispatch({
                type: SET_SCREEN_NOTIFICATION,
                payload: {
                  state: true,
                  type: 'done',
                },
              });
              window.location.assign(redirectTo);
            }
          } else {
            store.dispatch({
              type: SET_SCREEN_NOTIFICATION,
              payload: {
                state: true,
                label: response.data.errorMessage,
                type: 'alert',
              },
            });
            store.dispatch({
              type: SET_ESTIMATION,
              payload: { status: 'pending' },
            });
            if (redirectTo) {
              window.location.assign(redirectTo);
            }
          }
          if (smallLoader) {
            store.dispatch({
              type: SPINNER_SMALL,
              payload: {
                [smallLoader]: false,
              },
            });
          } else {
            store.dispatch({
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case DELETE_ESTIMATION: {
      const {
        id,
        reloadBuyerEstimations,
      } = action.payload
      api.estimation.deleteEstimation(id)
        .then(() => {
          if (reloadBuyerEstimations) {
            const data = {
              direction: 'DESC',
              offset: 0,
              isBuyer: true,
              order: 'updatedAt',
              ownerId: get(store.getState(), 'user.loggedInUser.user.id', ''),
              resultsPerPage: 50,
            }
            store.dispatch({ type: GET_OWNED_ESTIMATIONS, payload: data })
          }
        })
      break;
    }
    case SEND_PROESTIMATION_NOTIFICATION: {
      next(action);
      const {
        id,
      } = action.payload;
      api.estimation.proEstimationNotification(id)
        .then(() => {
          // console.log(res);
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkEstimation;
