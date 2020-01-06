import { createActions } from 'redux-actions';
import {
  ADD_PROPERTY,
  GET_ESTIMATION,
  SET_ESTIMATION,
  SET_PROPERTY,
} from './types/PropertyTypes';

export const {
  addProperty,
  getEstimation,
  setEstimation,
  setProperty
} = createActions({
  [ADD_PROPERTY]: (payload) => payload,
  [GET_ESTIMATION]: (payload) => payload,
  [SET_ESTIMATION]: (payload) => payload,
  [SET_PROPERTY]: (payload) => payload,
});
