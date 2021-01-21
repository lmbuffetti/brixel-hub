import {
  CREATE_ESTIMATION,
  GENERATE_ESTIMATION,
  SAVE_ACTIVE_SINGLE_ESTIMATION,
  DELETE_ACTIVE_SINGLE_ESTIMATION,
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
      api.estimation.createEstimation(action.payload)
        .then((response) => {
          if (response.meta.normalizedStatus === 200) {
            store.dispatch({
              type: SET_ESTIMATION,
              payload: response.data,
            });
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
      api.estimation.generateEstimation(action.payload)
        .then((response) => {
          if (response.meta.normalizedStatus === 200) {
            store.dispatch({
              type: SET_ESTIMATION,
              payload: response.data,
            });
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
    default:
      next(action);
  }
};

export default checkEstimation;
