import get from 'lodash/get';

import { configureStore } from '../store';
const configLang = configureStore.getState().common.languages;

const dynImport = {};
Object.keys(configLang).map((key) => {
  const langCode = configLang[key].value;
  // eslint-disable-next-line import/no-dynamic-require,global-require
  dynImport[langCode] = require(`../resources/translation/onboarding_${langCode}.json`);
  return null;
});

export const translateTo = (lang, word) => {
  const translated = word;
  const translateFile = dynImport[lang];
  let translation = get(translateFile, word, word);
  if (typeof translation !== 'undefined') {
    return translation || translated;
  }
  return word;
};
