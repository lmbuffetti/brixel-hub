/* global Transifex */
import get from 'lodash/get';
import { translateTo } from './translation';
import { FormatValue } from '@brixel/brixel-components';

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
  ]
}

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
  ]
}

export const titleProperty = (location, propertyType, lang, formValue) => {
  const getCountry = get(location, 'countryCode', null);
  let adjective = aptAdjective;
  let pageTitle;
  let translatedPropertyType = translateTo(lang, propertyType);
  translatedPropertyType = Transifex.live.translateText(translatedPropertyType);
  if (propertyType === 'House') adjective = houseAdjective;
  if (getCountry === 'PT') {
    const bedrooms = get(formValue, 'properties.typology.bedrooms', null);
    const livingSpace = get(formValue, 'properties.typology.livingArea.value', null);
    const location = get(formValue, 'location', null);
    if (bedrooms >= 0 && livingSpace && location) {
      const typology = FormatValue.formatRooms(bedrooms, 'pt');
      pageTitle = `${translatedPropertyType} ${typology} com ${livingSpace}m2 em ${location.name}, ${location.city}`;
    }
  } else if (getCountry && propertyType) {
    const randomNumber = Math.floor(Math.random() * adjective.en.length);
    pageTitle = `${adjective.en[randomNumber]} ${translatedPropertyType}`;
    if (getCountry === 'CH') {
      pageTitle = `${adjective.de[randomNumber]} ${translatedPropertyType}`;
    }
    if (location.city) {
      pageTitle += ' in ' + location.city;
    } else if (location.state) {
      pageTitle += ' in ' + location.state;
    } else if (location.country) {
      pageTitle += ' in ' + location.country;
    } else {
      pageTitle += ' in ' + location.address;
    }
  }
  return pageTitle;
};
