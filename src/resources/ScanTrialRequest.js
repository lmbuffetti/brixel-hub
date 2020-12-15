/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelInputText,
  BrixelTextArea,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import IntroScanFlow from '../Pages/ScanTrialFlow/IntroScanFlow';
import { configureStore } from '../store';
import scanComplete from '../images/Upgrade/upgrade_complete.svg';

export const ScanTrialQuestions = () => {
  const formValue = get(configureStore.getState(), 'brixelForm.scanFlow.values', {});
  const isInterested = get(formValue, 'interested', false);
  const { factsOptions } = FactsOptions;
  return [
    {
      history: 'servicePackage',
      component: IntroScanFlow,
    },
    {
      title: isInterested ? 'Please just confirm your personal data so we can reach out to you.' : 'Fair enough. Please let us know why you are not interested to help improve our product.',
      history: isInterested ? 'contactInformation' : 'feedbackForm',
      vCentered: true,
      inputs: [
        {
          condition: [{
            name: 'interested',
            value: false,
          }],
          component: BrixelCheckbox,
          label: '',
          name: 'answers',
          placeholder: '',
          options: factsOptions.scanTrialFeedback,
        },
        {
          condition: [{
            name: 'interested',
            value: true,
          }],
          component: BrixelInputText,
          label: 'Your full name',
          name: 'contactFullName',
          placeholder: '',
          validation: [Validation.required],
        },
        {
          condition: [{
            name: 'interested',
            value: true,
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
            name: 'interested',
            value: true,
          }],
          component: BrixelInputText,
          label: 'E-mail',
          name: 'contactEmail',
          placeholder: 'hans.muster@amazon.com',
          validation: [Validation.isEmail, Validation.required],
        },
        {
          condition: [{
            name: 'interested',
            value: true,
          }],
          component: BrixelCheckbox,
          label: 'What do you want to us to do?',
          name: 'answers',
          placeholder: '',
          options: factsOptions.scanTrialInterest,
        },
        {
          condition: [{
            name: 'interested',
            value: true,
          }],
          component: BrixelTextArea,
          label: 'Comments',
          name: 'comments',
          placeholder: '',
          className: 'mb-5',
          options: factsOptions.scanTrialInterest,
        },
      ],
    },
    {
      title: 'Thanks for your feedback',
      img: scanComplete,
      subtitle: isInterested ? 'We will work on your feedback.' : 'We will contact as soos as possible',
      history: 'success',
      vCentered: true,
      toSave: true,
    },
  ];
};
