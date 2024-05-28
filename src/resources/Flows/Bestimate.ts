/* eslint-disable max-len */
import {BestimateCH} from './Bestimate-CH';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';

export const BestimateQuestions = (type, propertyType, lang) => {
  const bestimate: QuestionsListType[] = BestimateCH(type, propertyType, lang);
  return bestimate;
};
