import { InputSheetsConfig } from '@brixel/brixel-configuration-partner/src/InputSheets';
import Maps from '../components/Map/Maps';
import { configureStore } from '../store';

export const InputSheets = () => {
  if (configureStore) return InputSheetsConfig('hub', configureStore.getState(), Maps);
  return {};
}
