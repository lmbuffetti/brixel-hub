import {translateTo} from '@brixel/brixel-components';
import get from 'lodash/get';
import {configureStore} from '../store';

const translateToComponent = (word: string, lang: string, options: object | null = null) => {
  const store = configureStore;
  const translations = get(store.getState(), 'translations', {});
  return translateTo(word, lang, options, translations) || word;
};

export default translateToComponent;
