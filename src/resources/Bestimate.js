/* eslint-disable max-len */
import get from 'lodash/get';
import { BestimateCH } from './Bestimate-CH';
import { BestimatePT } from './Bestimate-PT';
import { configureStore } from '../store';

export const BestimateQuestions = (type) => {
  const countryCode = get(configureStore.getState(), 'property.activeSingleProperty.location.countryCode', '');
  let bestimate = BestimateCH(type);
  if (countryCode === 'PT') bestimate = BestimatePT(type);
  return bestimate;
};
