import { createActions } from 'redux-actions';
import {
  ADD_PROPERTY,
  GET_ESTIMATION,
  SET_ESTIMATION,
  GET_PROPERTIES,
  SET_PROPERTIES,
  GET_PROPERTY,
  SET_PROPERTY,
} from './types/PropertyTypes';

export const {
  addProperty,
  getEstimation,
  setEstimation,
  getProperties,
  setProperties,
  getProperty,
  setProperty
} = createActions({
  [ADD_PROPERTY]: (payload) => payload,
  [GET_ESTIMATION]: (payload) => payload,
  [SET_ESTIMATION]: (payload) => payload,
  [GET_PROPERTIES]: (payload) => payload,
  [SET_PROPERTIES]: (payload) => payload,
  [GET_PROPERTY]: (payload) => payload,
  [SET_PROPERTY]: (payload) => payload,
});
