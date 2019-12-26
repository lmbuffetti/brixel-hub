import { configLang } from '../constants/global';
import { configureStore } from '../store';

const dynImport = {};
Object.keys(configLang).map((key) => {
  const langCode = configLang[key].code;
  // eslint-disable-next-line import/no-dynamic-require,global-require
  dynImport[langCode] = require(`./translations/${langCode}.js`);
  return null;
});

export const translateTo = (lang, word) => {
  const translated = word;
  const translateFile = configureStore.getState().common.translation || dynImport[lang][lang];
  const findIndex = Object.keys(translateFile).find((item) => item === word);
  const translation = translateFile[findIndex];
  if (typeof window === 'undefined') {
    return translation || translated;
  }
  return word;
};
