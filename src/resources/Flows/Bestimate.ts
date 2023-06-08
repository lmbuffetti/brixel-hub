/* eslint-disable max-len */
import get from 'lodash/get';
import {BestimateCH} from './Bestimate-CH';
import {BestimatePT} from './Bestimate-PT';
import {configureStore} from '../../store';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';

export const BestimateQuestions = (type, country = '', propertyType, lang) => {
  const countryCode = get(configureStore.getState(), 'property.activeSingleProperty.location.countryCode', country);
  let bestimate: QuestionsListType[] = BestimatePT(type, propertyType, lang);
  if (countryCode === 'CH') bestimate = BestimateCH(type, propertyType, lang);
  return bestimate;
};
