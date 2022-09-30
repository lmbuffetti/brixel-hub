import get from 'lodash/get';
import { translateTo } from '@brixel/brixel-components';
import { configureStore } from '../store';

const translateToComponent = (word, lang, options) => {
  const store = configureStore;
  // const lang = get(store.getState(), 'common.language', 'en');
  const translations = get(store.getState(), 'translations', {});
  return translateTo(word, lang, options, translations);
};

export default translateToComponent;
