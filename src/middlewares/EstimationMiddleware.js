import set from 'lodash/set';

import {
  CREATE_ESTIMATION,
  GENERATE_ESTIMATION,
  // SAVE_ACTIVE_SINGLE_ESTIMATION,
  // DELETE_ACTIVE_SINGLE_ESTIMATION,
} from '../actions/types/EstimationTypes';

import {
  SET_ESTIMATION,
} from '../actions/types/PropertyTypes';

import {
  SPINNER_ON,
  SPINNER_OFF,
  SET_SCREEN_NOTIFICATION,
} from '../actions/types/CommonTypes';

import api from '../controllers/api/config';

const checkEstimation = (store) => (next) => (action) => {
  switch (action.type) {
    case CREATE_ESTIMATION: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      const { generate, redirectTo } = action.payload;
      delete action.payload.generate;
      api.estimation.createEstimation(action.payload)
        .then((response) => {
          if (response.meta.normalizedStatus === 200) {
            if (generate === true) {
              store.dispatch({
                type: GENERATE_ESTIMATION,
                payload: {
                  id: response.data.id,
                  redirectTo,
                },
              });
            } else if (redirectTo) {
              window.location.href = redirectTo;
            }
            store.dispatch({
              type: SPINNER_OFF,
            });
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
              type: SPINNER_OFF,
            });
          }
        });
      break;
    }
    case GENERATE_ESTIMATION: {
      next(action);
      store.dispatch({
        type: SPINNER_ON,
      });
      const { redirectTo } = action.payload;
      api.estimation.generateEstimation(action.payload.id || action.payload)
        .then((response) => {
          if (response.meta.normalizedStatus === 200) {
            store.dispatch({
              type: SET_ESTIMATION,
              payload: response.data,
            });
            set(store.getState().property.activeSingleProperty, 'estimation', response.data);
            store.dispatch({
              type: SPINNER_OFF,
            });
            if (redirectTo) {
              window.location.href = redirectTo;
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
              type: SPINNER_OFF,
            });
            if (redirectTo) {
              window.location.href = redirectTo;
            }
          }
        });
      break;
    }
    default:
      next(action);
  }
};

export default checkEstimation;
