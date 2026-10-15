import get from 'lodash/get';
import { InputSheetsConfig } from '@brixel-io/brixel-components/dist/configuration/InputSheets';
import { ProEstimationConfig } from '@brixel-io/brixel-components/dist/configuration/ProEstimation';
import { PropertyDescriptionConfig } from '@brixel-io/brixel-components/dist/configuration/PropertyDescription';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import { configureStore } from '../../store';
export const InputSheets = (type = 'facts', lang, changeField) => {
    let Input = [];
    if (configureStore) {
        const store = configureStore.getState();
        if (type === 'proEstimation')
            Input = ProEstimationConfig('hub', store, 'brixelForm', lang);
        else if (type === 'description')
            Input = PropertyDescriptionConfig('hub', store, lang);
        else
            Input = InputSheetsConfig('hub', store, 'brixelForm', lang, changeField, baseByData);
    }
    const filteredInput = [];
    Input.forEach((item, i) => {
        filteredInput[i] = item;
        filteredInput[i].inputs = get(item, 'inputs', []).filter((subitem) => get(subitem, 'hide', null) !== true);
    });
    return filteredInput;
};
