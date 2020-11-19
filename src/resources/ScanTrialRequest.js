/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelRadioButton,
  BrixelInputText,
  Validation,
} from '@brixel/brixel-components';
import { translateTo } from '../utils/translation';
import IntroScanFlow from '../Pages/ScanTrialFlow/IntroScanFlow';

export const ScanTrialQuestions = (lang = {}) => [
  {
    title: translateTo(lang, 'Do you want to upgrade?'),
    subtitle: '<span class="txtGreen400">Save</span> on average compared to traditional agents.',
    history: 'servicePackage',
    component: IntroScanFlow,
  },
  {
    title: translateTo(lang, 'Please just confirm your personal data so we can reach out to you.'),
    history: 'wantToStart',
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
    title: translateTo(lang, 'Great. Your order is complete. '),
    subtitle: 'We will reach out to you to organise the further steps and clarify all your questions.',
    history: 'upgradeType',
    vCentered: true,
    toSave: true,
  },
];
