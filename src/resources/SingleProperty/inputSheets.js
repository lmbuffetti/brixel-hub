import { InputSheetsConfig } from '@brixel/brixel-components/dist/configuration/InputSheets';
import { ProEstimationConfig } from '@brixel/brixel-components/dist/configuration/ProEstimation';
import { configureStore } from '../../store';

export const InputSheets = (type = 'facts', lang) => {
  let Input = [];
  if (configureStore) {
    if (type === 'proEstimation') Input = ProEstimationConfig('hub', configureStore.getState(), 'brixelForm', lang);
    else Input = InputSheetsConfig('hub', configureStore.getState(), 'brixelForm', lang);
  }
  const filteredInput = [];
  Input.forEach((item, i) => {
    filteredInput[i] = item;
    filteredInput[i].inputs = item.inputs.filter((subitem) => subitem.hide !== true);
  });
  return filteredInput;
};
