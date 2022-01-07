/* global Transifex */
import get from 'lodash/get';

// import { configureStore } from '../store';
const configLang = [
  { value: 'dk', label: 'dk' },
  { value: 'de', label: 'de' },
  { value: 'en', label: 'en' },
  { value: 'nl', label: 'nl' },
  { value: 'pt', label: 'pt' },
  { value: 'se', label: 'se' }
];

const dynImport = {};
const dynImportGeneral = {};
Object.keys(configLang).map((key) => {
  const langCode = configLang[key].value;
  // eslint-disable-next-line import/no-dynamic-require,global-require
  dynImport[langCode] = require(`../resources/translation/onboarding_${langCode}.js`);
  // eslint-disable-next-line import/no-dynamic-require,global-require
  dynImportGeneral[langCode] = require(`../resources/translation/general_${langCode}.js`);
  return null;
});

export const translateTo = (lang, word) => {
  let exist = false;
  if (typeof Transifex !== 'undefined') {
    if (Transifex && Transifex.live.getAllLanguages()) {
      const transLang = Transifex.live.getAllLanguages();
      const compareLang = transLang.find((item) => item.code === lang);
      exist = typeof compareLang !== 'undefined';
    }
  }
  let translateFile = dynImport.en;
  if (!exist) {
    translateFile = dynImport[lang];
  }
  const translated = word;
  const translation = get(translateFile, word, word);
  if (typeof translation !== 'undefined') {
    return translation || translated;
  }
  return word;
};

export const generalTranslate = (lang, word) => {
  const translated = word;
  const translateFile = dynImportGeneral[lang];
  const translation = get(translateFile, word, word);
  if (typeof translation !== 'undefined') {
    return translation || translated;
  }
  return word;
};
