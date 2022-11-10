import { translateTo } from '@brixel/brixel-components';
import get from 'lodash/get';
import { configureStore } from '../store';

const translateToComponent = (word, lang, options) => {
  const store = configureStore;
  const translations = get(store.getState(), 'translations', {});
  return translateTo(word, lang, options, translations);
};

export default translateToComponent;
