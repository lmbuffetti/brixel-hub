import get from 'lodash/get';
import { translateTo } from '@brixel/brixel-components';
import { configureStore } from '../store';

const translateToComponent = (word) => {
  const store = configureStore;
  const lang = get(store.getState(), 'common.language', 'en');
  const translations = get(store.getState(), 'common.translations', {});
  return translateTo(word, lang, translations);
};

export default translateToComponent;
