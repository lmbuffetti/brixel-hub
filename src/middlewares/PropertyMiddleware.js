/* eslint-disable no-case-declarations */
import { change } from 'redux-form';
import {
  ADD_PROPERTY,
  GET_ESTIMATION,
  GET_PROPERTIES,
  SET_PROPERTIES,
  SET_ESTIMATION,
  SET_PROPERTY,
} from '../actions/types/PropertyTypes';

import api from '../controllers/api/config';
import { UPDATE_USER } from '../actions/types/UserTypes';
import { SPINNER_ON, SPINNER_OFF } from '../actions/types/CommonTypes';

const checkCommon = (store) => (next) => (action) => {
  switch (action.type) {
    case ADD_PROPERTY:
      next(action);
      store.dispatch({ type: SPINNER_ON });
      const { getEstimation } = action.payload;
      delete action.payload.getEstimation;
      api.property.addProperty(action.payload)
        .then((res) => {
          store.dispatch({ type: SET_PROPERTY, payload: res.data });
          store.dispatch({ type: SPINNER_OFF });
          if (getEstimation) {
            store.dispatch({ type: GET_ESTIMATION, payload: res.data.id });
          }
        })
        .catch((res) => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    case GET_PROPERTIES:
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.property.getProperties(action.payload.limit, action.payload.offset)
        .then((res) => {
          store.dispatch({ type: SET_PROPERTIES, payload: res.data });
          store.dispatch({ type: SPINNER_OFF });
        })
        .catch((res) => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    case GET_ESTIMATION:
      next(action);
      store.dispatch({ type: SPINNER_ON });
      api.property.getEstimation(action.payload)
        .then((res) => {
          store.dispatch({ type: SPINNER_OFF });
          store.dispatch({ type: SET_ESTIMATION, payload: res.data });
          if (typeof res.data.statusCode === 'undefined') {
            window.location.href = `/packageFlow/${action.payload}/rewards`
          }
        })
        .catch((res) => {
          store.dispatch({ type: SPINNER_OFF });
        });
      break;
    default:
      next(action);
  }
};

export default checkCommon;
