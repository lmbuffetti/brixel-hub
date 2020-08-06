/* global Transifex */
import get from 'lodash/get';
import { FormatValue } from '@brixel/brixel-components';
import { translateTo } from './translation';

const aptAdjective = {
  de: [
    'Schöne',
    'Charmante',
    'Elegante',
    'Repräsentative',
    'Einzigartige',
    'Herrliche',
    'Geräumige',
    'Prächtige',
    'Wunderbare',
    'Hübsche',
    'Stattliche',
    'Tolle',
    'Umwerfende',
    'Schicke',
    'Moderne',
    'Traumhafte',
  ],
  en: [
    'Beautiful',
    'Charming',
    'Elegant',
    'Prestigious',
    'One-of-a-kind',
    'Exquisite',
    'Spacious',
    'Gorgeous',
    'Wonderful',
    'Lovely',
    'Superb',
    'Amazing',
    'Stunning',
    'Sophisticated',
    'Modern',
    'Incredible',
  ],
};

const houseAdjective = {
  de: [
    'Schönes',
    'Charmantes',
    'Elegantes',
    'Repräsentatives',
    'Einzigartiges',
    'Herrliches',
    'Geräumiges',
    'Prächtiges',
    'Wunderbares',
    'Hübsches',
    'Stattliches',
    'Tolles',
    'Umwerfendes',
    'Schickes',
    'Modernes',
    'Traumhaftes',
  ],
  en: [
    'Beautiful',
    'Charming',
    'Elegant',
    'Prestigious',
    'One-of-a-kind',
    'Exquisite',
    'Spacious',
    'Gorgeous',
    'Wonderful',
    'Lovely',
    'Superb',
    'Amazing',
    'Stunning',
    'Sophisticated',
    'Modern',
    'Incredible',
  ],
};

export const titleProperty = (location, propertyType, lang, formValue) => {
  const getCountry = get(location, 'countryCode', null);
  let adjective = aptAdjective;
  let pageTitle;
  let translatedPropertyType = translateTo(lang, propertyType);
  translatedPropertyType = (typeof Transifex !== 'undefined') ? Transifex.live.translateText(translatedPropertyType) : translatedPropertyType;
  if (propertyType === 'House') adjective = houseAdjective;
  if (getCountry === 'PT') {
    const bedrooms = get(formValue, 'properties.typology.bedrooms', null);
    const livingSpace = get(formValue, 'properties.typology.grossArea.value', get(formValue, 'properties.typology.livingArea.value', null));
    const curLocation = get(formValue, 'location', null);
    if (bedrooms >= 0 && livingSpace && curLocation) {
      const typology = FormatValue.formatRooms(bedrooms, 'pt');
      pageTitle = `${translatedPropertyType} ${typology} com ${livingSpace}m2 em ${curLocation.name}, ${curLocation.city}`;
    }
  } else if (getCountry && propertyType) {
    const randomNumber = Math.floor(Math.random() * adjective.en.length);
    pageTitle = `${adjective.en[randomNumber]} ${translatedPropertyType}`;
    if (getCountry === 'CH' || getCountry === 'DE' || getCountry === 'AT') {
      pageTitle = `${adjective.de[randomNumber]} ${translatedPropertyType}`;
    }
    if (location.city) {
      pageTitle += ` in ${location.city}`;
    } else if (location.state) {
      pageTitle += ` in ${location.state}`;
    } else if (location.country) {
      pageTitle += ` in ${location.country}`;
    } else {
      pageTitle += ` in ${location.address}`;
    }
  }
  return pageTitle;
};
