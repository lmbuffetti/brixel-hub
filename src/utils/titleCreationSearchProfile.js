import get from 'lodash/get';
import translateTo from './translation';

export const titleSearchProfile = (formValue, lang) => {
  let pageTitle;
  let translatedPropertyType = '';
  const rooms = get(formValue, 'characteristics.bedrooms', {});
  const propertyType = get(formValue, 'characteristics.propertyType', []);
  const locations = get(formValue, 'locations', get(formValue, 'location', []));
  propertyType.forEach((property, index) => {
    const separator = index < propertyType.length -1 ? ', ' : '';
    translatedPropertyType += `${translateTo(property, lang)}${separator}`;
  });
  let roomsText = ''
  if (rooms.min > -1 && rooms.min !== rooms.max) roomsText = `${rooms.min} - ${rooms.max} rooms`;
  else if (rooms.min > -1 && rooms.min === rooms.max) roomsText = `${rooms.min} rooms`;
  
  let locationText = '';
  locations.forEach((location, index) => {
    const separator = index < locations.length -1 ? ', ' : '';
    locationText += `${location.city}${separator}`;
  });
  
  pageTitle = `${roomsText} ${translatedPropertyType}`;
  if (location) pageTitle += ` ${translateTo('in', lang)} ${locationText}`
  return pageTitle;
};
