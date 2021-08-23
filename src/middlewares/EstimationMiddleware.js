import set from 'lodash/set';

import get from 'lodash/get';
import {
  CREATE_ESTIMATION,
  GENERATE_ESTIMATION,
  SEND_PROESTIMATION_NOTIFICATION,
  // SAVE_ACTIVE_SINGLE_ESTIMATION,
  // DELETE_ACTIVE_SINGLE_ESTIMATION,
} from '../actions/types/EstimationTypes';

import {
  SET_ESTIMATION,
} from '../actions/types/PropertyTypes';

import {
  SET_OWNED_PROPERTIES,
} from '../actions/types/MarketTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
  SET_SCREEN_NOTIFICATION,
  SPINNER_SMALL,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkEstimation = (store) => (next) => (action) => {
  switch (action.type) {
    case CREATE_ESTIMATION: {
      next(action);
      const { generate, redirectTo, smallLoader } = action.payload;
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
      delete action.payload.generate;
      delete action.payload.smallLoader;
      api.estimation.createEstimation(action.payload)
        .then((response) => {
          if (response.meta.normalizedStatus === 200) {
            if (generate === true) {
              store.dispatch({
                type: GENERATE_ESTIMATION,
                payload: {
                  id: response.data.id,
                  page: action.payload.page,
                  redirectTo,
                  reloadOnwProperties: get(action.payload, 'reloadOnwProperties', false),
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
      const { page, redirectTo, smallLoader } = action.payload;
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
      api.estimation.generateEstimation(action.payload.id || action.payload)
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
