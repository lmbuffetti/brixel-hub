import get from 'lodash/get';
import {QuestionsList} from '../resources/Flows/onBoardingBuyer';
import translateTo from './translation';
import {QuestionInputType} from '@brixel-io/brixel-components/dist/@types/Model';


export const titleSearchProfile = (formValue, lang) => {
  let pageTitle;
  let translatedPropertyType = '';
  const inputs: QuestionInputType[] = [];
  QuestionsList(lang, '', () => '', '').forEach((input) => {
    if(input.inputs) {
      input.inputs.forEach((inp) => {
        inputs.push(inp);
      })
    }
  })
  const checkMaxValue = inputs.filter((inp: QuestionInputType) => inp.maxLengthNum);
  const maxValue = {};
  checkMaxValue.forEach((val: QuestionInputType) => {
    if(!get(formValue, `${val.name}.max`, null) && val.name) {
      maxValue[val.name] = val.maxLengthNum;
    }
  })
  const dafualtValRooms = {min: 0, max: maxValue['characteristics.bedrooms']};
  const rooms = get(formValue, 'characteristics.bedrooms', dafualtValRooms);
  const propertyType = get(formValue, 'characteristics.propertyType', []);
  const locations = get(formValue, 'locations', get(formValue, 'location', []));
  if (propertyType) {
    propertyType.forEach((property, index) => {
      const separator = index < propertyType.length - 1 ? ', ' : '';
      translatedPropertyType += `${translateTo(property, lang)}${separator}`;
    });
  }
  let roomsText = ''
  if (rooms.min > -1 && rooms.min !== rooms.max) roomsText = `${rooms.min || dafualtValRooms.min} - ${rooms.max || dafualtValRooms.max} ${translateTo('rooms', lang)}`;
  else if (rooms.min > -1 && rooms.min === rooms.max) roomsText = `${rooms.min} ${translateTo('rooms', lang)}`;

  let locationText = '';
  if (locations) {
    locations.forEach((location, index) => {
      const separator = index < locations.length -1 ? ', ' : '';
      locationText += `${location.city}${separator}`;
    });
  }
  pageTitle = `${roomsText} ${translatedPropertyType}`;
  if (location && locationText) pageTitle += ` ${translateTo('in', lang)} ${locationText}`
  return pageTitle;
};
