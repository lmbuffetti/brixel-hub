import { InputSheetsConfig } from '@brixel/brixel-components/dist/configuration/InputSheets';
import { ProEstimationConfig } from '@brixel/brixel-components/dist/configuration/ProEstimation';
import Maps from '../../components/Map/Maps';
import { configureStore } from '../../store';

export const InputSheets = (type = 'facts', lang) => {
  let Input = [];
  if (configureStore) {
    if (type === 'proEstimation') Input = ProEstimationConfig('hub', configureStore.getState(), Maps, 'brixelForm', lang);
    else Input = InputSheetsConfig('hub', configureStore.getState(), Maps, 'brixelForm', lang);
  }
  const filteredInput = [];
  Input.forEach((item, i) => {
    filteredInput[i] = item;
    filteredInput[i].inputs = item.inputs.filter((subitem) => subitem.hide !== true);
  });
  return filteredInput;
};
