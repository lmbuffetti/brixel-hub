/* eslint-disable max-len */
import get from 'lodash/get';
import { BestimateCH } from './Bestimate-CH';
import { BestimatePT } from './Bestimate-PT';
import { configureStore } from '../store';

export const BestimateQuestions = (type, country = '') => {
  const countryCode = get(configureStore.getState(), 'property.activeSingleProperty.location.countryCode', country);
  let bestimate = BestimatePT(type);
  if (countryCode === 'CH') bestimate = BestimateCH(type);
  return bestimate;
};
