import get from 'lodash/get';
import {InputSheetsConfig} from '@brixel/brixel-components/dist/configuration/InputSheets';
import {ProEstimationConfig} from '@brixel/brixel-components/dist/configuration/ProEstimation';
import baseByData from '@brixel/brixel-components/dist/configuration/Settings';
import {configureStore} from '../../store';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

export const InputSheets = (type = 'facts', lang, changeField) => {
  let Input: object[] = [];
  if (configureStore) {
    const store: any = configureStore.getState();
    if (type === 'proEstimation') Input = ProEstimationConfig('hub', store, 'brixelForm', lang);
    else Input = InputSheetsConfig('hub', store, 'brixelForm', lang, changeField, baseByData);
  }
  const filteredInput: QuestionsListType[] = [];
  Input.forEach((item, i) => {
    filteredInput[i] = item;
    filteredInput[i].inputs = get(item, 'inputs', []).filter((subitem) => get(subitem, 'hide', null) !== true);
  });
  return filteredInput;
};
