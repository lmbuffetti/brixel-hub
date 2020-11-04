/* eslint-disable max-len */
import get from 'lodash/get';
import { BestimateCH } from './Bestimate-CH';
import { BestimatePT } from './Bestimate-PT';
import { configureStore } from '../store';

export const BestimateQuestions = () => {
  const countryCode = get(configureStore.getState(), 'property.activeSingleProperty.location.countryCode', '');
  let bestimate = BestimateCH();
  if (countryCode === 'PT') bestimate = BestimatePT();
  console.log(countryCode, configureStore.getState());
  return bestimate;
};
