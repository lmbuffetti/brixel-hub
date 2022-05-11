import { InputSheetsConfig } from '@brixel/brixel-configuration-partner/dist/InputSheets';
import { ProEstimationConfig } from '@brixel/brixel-configuration-partner/dist/ProEstimation';
import { FactsOptions } from '@brixel/brixel-components';
import {
  BrixelCheckbox,
  BrixelExtraFeature,
  BrixelInputQuality,
  BrixelInputScale,
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelRadioButton,
  BrixelSelect,
  BrixelTextArea,
  Validation,
} from '@brixel/brixel-components/dist/form';
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

export const InputSheets = (type = 'facts') => {
  let Input = [];
  if (configureStore) {
    if (type === 'proEstimation') Input = ProEstimationConfig('hub', configureStore.getState(), Maps, 'brixelForm', componentsList);
    else Input = InputSheetsConfig('hub', configureStore.getState(), Maps, 'brixelForm', componentsList);
  }
  const filteredInput = [];
  Input.forEach((item, i) => {
    filteredInput[i] = item;
    filteredInput[i].inputs = item.inputs.filter((subitem) => subitem.hide !== true);
  });
  return filteredInput;
};
