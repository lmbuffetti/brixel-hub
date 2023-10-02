import get from 'lodash/get';
import {FormatValue} from '@brixel-io/brixel-components';
import translateTo from './translation';

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
  it: [
    'Luminoso',
    'Confortevole',
    'Elegante',
    'Prestigioso',
    'Spazioso',
    'Superbo',
    'Splendido',
    'Signorile',
    'Sofisticato',
    'Moderno',
    'Incredibile',
  ],
  pt: [
    'Charmoso',
    'Elegante',
    'Confortável',
    'Sofisticado',
    'Moderno',
    'Aconchegante',
    'Acolhedor',
    'Luminoso',
  ],
  fr: [
    'Magnifique',
    'Charmant',
    'Élégant',
    'Somptueux',
    'Splendide',
    'Ravissant',
    'Spacieux',
    'Superbe',
    'Incroyable',
    'Séduisant',
    'Bel',
    'Agréable',
    'Sublime',
    'Prestigieux',
    'Joli',
    'Luxueux',
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
  it: [
    'Luminosa',
    'Confortevole',
    'Elegante',
    'Prestigiosa',
    'Spaziosa',
    'Superba',
    'Splendida',
    'Signorile',
    'Sofisticata',
    'Moderna',
    'Incredibile',
  ],
  pt: [
    'Charmosa',
    'Elegante',
    'Confortável',
    'Sofisticada',
    'Moderna',
    'Aconchegante',
    'Acolhedora',
    'Luminosa',
  ],
  fr: [
    'Magnifique',
    'Charmante',
    'Élégante',
    'Somptueuse',
    'Splendide',
    'Ravissante',
    'Spacieuse',
    'Superbe',
    'Incroyable',
    'Séduisante',
    'Belle',
    'Agréable',
    'Sublime',
    'Prestigieuse',
    'Jolie',
    'Luxueuse',
  ],
};

const buildingLandAdjective = {
  de: [
    'Schönes',
    'Einzigartiges',
    'Prächtiges',
    'Wunderbares',
    'Hübsches',
    'Stattliches',
    'Tolles',
    'Umwerfendes',
    'Schickes',
    'Traumhaftes',
  ],
  en: [
    'Beautiful',
    'Prestigious',
    'One-of-a-kind',
    'Exquisite',
    'Spacious',
    'Lovely',
    'Superb',
    'Amazing',
    'Stunning',
  ],
  it: [
    'Luminoso',
    'Confortevole',
    'Prestigioso',
    'Spazioso',
    'Superbo',
    'Splendido',
    'Signorile',
  ],
  pt: [
    'Charmosa',
    'Elegante',
    'Confortável',
    'Aconchegante',
    'Acolhedora',
    'Luminosa',
  ],
  fr: [
    'Magnifique',
    'Charmante',
    'Élégante',
    'Prestigieuse',
    'Unique',
    'Exquisite',
    'Spacieuse',
    'Superbe',
    'Merveilleuse',
    'Aimante',
    'Superbe',
    'Incroyable',
    'Fabuleuse',
    'Sophistiquée',
    'Moderne',
    'Incroyable',
  ],
};



export const titleProperty = (location, propertyType, lang, formValue) => {
  const getCountry = get(location, 'countryCode', null);
  let adjective = aptAdjective;
  let pageTitle;
  const translatedPropertyType = translateTo(propertyType, lang);
  if (propertyType === 'House' || propertyType === 'Commercial') adjective = houseAdjective;
  if (propertyType === 'Building land') adjective = buildingLandAdjective;
  if (getCountry === 'PT') {
    const bedrooms = get(formValue, 'properties.typology.bedrooms', null);
    const livingSpace = get(formValue, 'properties.typology.grossArea.value', get(formValue, 'properties.typology.livingArea.value', null));

    const curLocation = get(formValue, 'location', null);
    if (bedrooms >= 0 && livingSpace && curLocation) {
      const typology = FormatValue.formatRooms(bedrooms, 'pt');
      pageTitle = `${translatedPropertyType} ${typology} com ${livingSpace}m2, ${curLocation.city}`;
    }
  } else if (getCountry && propertyType) {
    const array = new Uint8Array(256);
    const randomMthNr = crypto.getRandomValues(array);
    if (adjective[lang]) {
      const randomNumber = randomMthNr.find(r => r < adjective[lang].length) || 0;
      pageTitle = adjective[lang] ? `${adjective[lang][randomNumber]} ${translatedPropertyType}` : `${adjective.en[randomNumber]} ${translatedPropertyType}`;
    } else {
      const randomNumber = randomMthNr.find(r => r < adjective.en.length) || 0;
      pageTitle = `${adjective.en[randomNumber]} ${translatedPropertyType}`;
      pageTitle = adjective[lang] ? `${adjective[lang][randomNumber]} ${translatedPropertyType}` : `${adjective.en[randomNumber]} ${translatedPropertyType}`;
    }
    if (location.city) {
      if (lang === 'fr') pageTitle += ` á ${location.city}`;
      else if (lang === 'it') pageTitle += ` a ${location.city}`;
      else  pageTitle += ` in ${location.city}`;
    } else if (location.state) {
      if (lang === 'fr') pageTitle += ` á ${location.state}`;
      else if (lang === 'it') pageTitle += ` a ${location.state}`;
      else pageTitle += ` in ${location.state}`;
    } else if (location.country) {
      if (lang === 'fr') pageTitle += ` á ${location.country}`;
      else if (lang === 'it') pageTitle += ` a ${location.country}`;
      else pageTitle += ` in ${location.country}`;
    } else {
      if (lang === 'fr') pageTitle += ` á ${location.address}`;
      else if (lang === 'it') pageTitle += ` a ${location.address}`;
      else pageTitle += ` in ${location.address}`;
    }
  }
  return pageTitle;
};
