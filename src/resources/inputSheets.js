import { InputSheetsConfig } from '@brixel/brixel-configuration-partner/src/InputSheets';
import {
  BrixelCheckbox,
  BrixelExtraFeature, BrixelInputQuality,
  BrixelInputScale, BrixelInputStepNumber,
  BrixelInputText,
  BrixelRadioButton, BrixelSelect, BrixelTextArea,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import Maps from '../components/Map/Maps';
import { configureStore } from '../store';

const componentsList = {
  BrixelCheckbox,
  BrixelExtraFeature,
  BrixelInputQuality,
  BrixelInputScale,
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelRadioButton,
  BrixelSelect,
  BrixelTextArea,
  FactsOptions,
  Validation,
};

export const InputSheets = () => {
  let Input = [];
  if (configureStore) Input = InputSheetsConfig('hub', configureStore.getState(), Maps, 'brixelForm', componentsList);
  const filteredInput = [];
  Input.forEach((item, i) => {
    filteredInput[i] = item;
    filteredInput[i].inputs = item.inputs.filter((subitem) => subitem.hide !== true);
  });
  return filteredInput;
};
