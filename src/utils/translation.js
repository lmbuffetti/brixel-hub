import get from 'lodash/get';
import { translateTo } from '@brixel/brixel-components';
import { configureStore } from '../store';
const store = configureStore;
const translateToComponent = (word) => {
  const lang = get(store.getState(), 'common.language', 'en');
  return translateTo(word, lang);
};

export default translateToComponent;
