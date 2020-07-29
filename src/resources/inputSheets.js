import { InputSheetsConfig } from '@brixel/brixel-configuration-partner/src/InputSheets';
import Maps from '../components/Map/Maps';
import { configureStore } from '../store';

export const InputSheets = () => {
  let Input = [];
  if (configureStore) Input = InputSheetsConfig('hub', configureStore.getState(), Maps);
  const filteredInput = [];
  Input.forEach((item, i) => {
    filteredInput[i] = item;
    filteredInput[i].inputs = item.inputs.filter((subitem) => subitem.hide !== true);
  });
  return filteredInput;
};
