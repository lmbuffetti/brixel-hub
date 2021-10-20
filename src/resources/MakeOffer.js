/* eslint-disable max-len */
import {
  BrixelRadioButton,
  BrixelInputText,
  BrixelInputTextStep,
  Validation,
  BrixelInputDatePicker,
  // FactsOptions,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import BookTrialFlow from '../Pages/ScanTrialFlow/BookTrialFlow';
import ResumeTrialFlow from '../Pages/ScanTrialFlow/ResumeTrialFlow';
import ClipboardImg from '../images/scanTrial/clipboard.png';
import { configureStore } from '../store';

// const { factsOptions } = FactsOptions;

export const MakeOfferQuestions = () => {
  let formValue = {};
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.offerFlow.values', []);
  }
  return [
    {
      title: 'Set your price',
      history: 'priceInfo',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5',
      inputs: [
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          disabled: true,
          component: BrixelInputText,
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          label: 'Listing price',
          name: 'propertyPrice',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
        },
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          component: BrixelInputTextStep,
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          label: 'Your offer',
          name: 'amount',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
        },
        {
          component: BrixelRadioButton,
          label: 'Do you already have a financing certificate?',
          name: 'financeCertificate',
          validation: [Validation.required],
          options: [{
            value: 1,
            label: 'Yes',
          }, {
            value: 0,
            label: 'No',
          }],
        },
      ],
    },
    {
      condition: [{
        name: 'financeCertificate',
        value: 1,
      }],
      title: 'Please tell us some more details',
      history: 'analysis',
      inputs: [{
        component: BrixelInputDatePicker,
        className: '',
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        ReduxFieldClass: '',
        label: '',
        name: 'buyer.dateBirth',
        validation: [Validation.required],
      }],
    },
    {
      cardType: 'loadComponent',
      history: 'BookTrialFlow',
      component: BookTrialFlow,
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          condition: [{
            name: 'bookType',
            value: 'online',
          },
          {
            name: 'bookType',
            value: 'schedule',
          }],
          name: 'phone',
        },
        {
          condition: [{
            name: 'bookType',
            value: 'online',
          },
          {
            name: 'bookType',
            value: 'schedule',
          }],
          name: 'dateBook',
          validation: [Validation.required],
        },
        {
          condition: [{
            name: 'bookType',
            value: 'online',
          },
          {
            name: 'bookType',
            value: 'schedule',
          }],
          name: 'hourBook',
          validation: [Validation.required],
        },
      ],
    },
    {
      conditions: [{
        name: 'step',
        noValue: 'skip',
      }],
      background: 'bgCardGreen',
      cardType: 'loadComponent',
      component: ResumeTrialFlow,
      history: 'resume',
      vCentered: true,
      toSave: true,
      classWrapper: '',
    },
    {
      hideProgress: true,
      conditions: [{
        name: 'bookType',
        value: 'whereby',
      }],
      step: 'wherebyResume',
      background: 'bgCardGreen',
      cardType: 'loadComponent',
      component: ResumeTrialFlow,
      history: 'whereby',
      vCentered: true,
      classWrapper: '',
    },
    {
      hideProgress: true,
      cardType: 'card',
      title: 'Get Prepared',
      img: ClipboardImg,
      imgMaxWidth: 'max-w-fix-160',
      cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
      subtitle: 'The more we know the better. Please fill out as many facts as possible for preparation.',
      history: 'success',
      vCentered: true,
      classWrapper: '',
      showExitText: true,
    },
  ];
};
