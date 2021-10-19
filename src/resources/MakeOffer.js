/* eslint-disable max-len */
import {
  BrixelRadioButton,
  BrixelInputText,
  BrixelInputTextStep,
  Validation,
  // FactsOptions,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import BookTrialFlow from '../Pages/ScanTrialFlow/BookTrialFlow';
import ResumeTrialFlow from '../Pages/ScanTrialFlow/ResumeTrialFlow';
import ClipboardImg from '../images/scanTrial/clipboard.png';
import { svgIcons } from './svgIcons';
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
      title: 'How do you want to do the analysis?',
      history: 'analysis',
      inputs: [{
        component: BrixelRadioButton,
        className: '',
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        ReduxFieldClass: '',
        label: '',
        name: 'analysis',
        validation: [Validation.required],
        icons: true,
        cardLayout: true,
        svgWidth: 'max-w-fix-96 max-w-fix-sm-192',
        stretched: true,
        pdClass: 'py-2 py-sm-5',
        svgSupport: true,
        isHorizontal: true,
        options: [
          {
            title: 'On-site',
            label: 'We visit you to evaluate your property.\n',
            value: 'on-site',
            img: svgIcons.onSite,
            color: 'blue',
          },
          {
            title: 'Remote',
            label: 'We get to know you and your property in a call.',
            value: 'remote',
            img: svgIcons.remote,
            color: 'green',
          },
        ],
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
