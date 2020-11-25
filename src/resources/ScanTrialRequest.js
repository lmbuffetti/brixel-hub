/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelInputText,
  BrixelTextArea,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import { translateTo } from '../utils/translation';
import IntroScanFlow from '../Pages/ScanTrialFlow/IntroScanFlow';
import { configureStore } from '../store';
import scanComplete from '../images/Upgrade/upgrade_complete.svg';

export const ScanTrialQuestions = (lang = {}) => {
  const formValue = get(configureStore.getState(), 'brixelForm.scanFlow.values', {});
  const isNotInterested = get(formValue, 'condition', null) === 'interested';
  const { factsOptions } = FactsOptions;
  return [
    {
      history: 'servicePackage',
      component: IntroScanFlow,
    },
    {
      title: isNotInterested ? translateTo(lang, 'Fair enough. Please let us know why you are not interested to help improve our product.') : translateTo(lang, 'Please just confirm your personal data so we can reach out to you.'),
      history: isNotInterested ? 'contactInformation' : 'feedbackForm',
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
          options: factsOptions.scanTrialFeedback,
        },
        {
          condition: [{
            name: 'condition',
            value: 'interested',
          }],
          component: BrixelInputText,
          label: 'Your full name',
          name: 'contactFullName',
          placeholder: '',
          validation: [Validation.required],
        },
        {
          condition: [{
            name: 'condition',
            value: 'interested',
          }],
          component: BrixelInputText,
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
          label: 'E-mail',
          name: 'contactEmail',
          placeholder: 'hans.muster@amazon.com',
          validation: [Validation.isEmail, Validation.required],
        },
        {
          condition: [{
            name: 'condition',
            value: 'interested',
          }],
          component: BrixelCheckbox,
          label: 'What do you want to us to do?',
          name: 'interest',
          placeholder: '',
          options: factsOptions.scanTrialInterest,
        },
        {
          condition: [{
            name: 'condition',
            value: 'interested',
          }],
          component: BrixelTextArea,
          label: 'Comments',
          name: 'comments',
          placeholder: '',
          options: factsOptions.scanTrialInterest,
        },
      ],
    },
    {
      title: translateTo(lang, 'Thanks for your feedback'),
      img: scanComplete,
      subtitle: isNotInterested ? 'We will work on your feedback.' : 'We will contact as soos as possible',
      history: 'success',
      vCentered: true,
      toSave: true,
    },
  ];
};
