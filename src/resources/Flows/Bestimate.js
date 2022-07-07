/* eslint-disable max-len */
import get from 'lodash/get';
import { BestimateCH } from './Bestimate-CH';
import { BestimatePT } from './Bestimate-PT';
import { configureStore } from '../../store';

// eslint-disable-next-line default-param-last
export const BestimateQuestions = (type, country = '', propertyType, lang) => {
  const countryCode = get(configureStore.getState(), 'property.activeSingleProperty.location.countryCode', country);
  let bestimate = BestimatePT(type, propertyType, lang);
  if (countryCode === 'CH') bestimate = BestimateCH(type, propertyType, lang);
  return bestimate;
};
