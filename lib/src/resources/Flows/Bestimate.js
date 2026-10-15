/* eslint-disable max-len */
import { BestimateCH } from './Bestimate-CH';
export const BestimateQuestions = (type, propertyType, lang) => {
    const bestimate = BestimateCH(type, propertyType, lang);
    return bestimate;
};
