/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelInputText,
  Validation,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { translateTo } from '../utils/translation';
import IntroScanFlow from '../Pages/ScanTrialFlow/IntroScanFlow';
import { configureStore } from '../store';

export const ScanTrialQuestions = (lang = {}) => {
  const formValue = get(configureStore.getState(), 'brixelForm.scanFlow.values', {});
  const isNotInterested = get(formValue, 'condition', null) === 'interested';
  return [
    {
      history: 'servicePackage',
      component: IntroScanFlow,
    },
    {
      title: isNotInterested ? 'Fair enough. Please let us know why you are not interested to help improve our product.' : 'Please just confirm your personal data so we can reach out to you.',
      history: 'contactInformation',
      vCentered: true,
      inputs: [
        {
          condition: [{
            name: 'condition',
            value: 'not-interested',
          }],
          component: BrixelCheckbox,
          label: '',
          name: 'feedback',
          placeholder: '',
          validation: [Validation.required],
          options: [
            {
              label: 'In the morning',
              value: 'morning',
            },
            {
              label: 'In the afternoon',
              value: 'afternoon',
            },
            {
              label: 'In the evening',
              value: 'evening',
            },
          ],
        },
        {
          condition: [{
            name: 'condition',
            value: 'interested',
          }],
          title: 'Are this your correct contact informations?',
          component: BrixelInputText,
          classNameBox: 'bgLight100 p-1',
          label: 'Phone number',
          name: 'contactPhone',
          formatType: 'tel',
          placeholder: '',
          validation: [Validation.required],
        },
        {
          condition: [{
            name: 'condition',
            value: 'interested',
          }],
          component: BrixelInputText,
          classNameBox: 'bgLight100 p-1 mb-2',
          label: 'E-mail',
          name: 'contactEmail',
          placeholder: 'hans.muster@amazon.com',
          validation: [Validation.isEmail, Validation.required],
        },
      ],
    },
    {
      title: translateTo(lang, 'Thanks for your feedback'),
      subtitle: 'We will contact as soos as possible',
      history: 'success',
      vCentered: true,
      toSave: true,
    },
  ];
};
