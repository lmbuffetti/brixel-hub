/* eslint-disable max-len */
/* eslint-disable react/jsx-filename-extension */
import {
  BrixelUploadFile,
  BrixelInputText,
  BrixelInputDatePicker,
  Validation,
  FactsOptions,
  BrixelSelect,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import ClipboardImg from '../images/scanTrial/clipboard.png';
// eslint-disable-next-line import/no-cycle
import IdentificationBuyerResume from '../Pages/Closing/Identification/IdentificationBuyerResume';
import { configureStore } from '../store';

const { factsOptions } = FactsOptions;

export const IdentificationQuestions = (editForm = false) => {
  let formValue = {};
  let isPT;
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.Identification.values', []);
    const countryCode = get(formValue, 'propertyLocation.countryCode', '');
    isPT = countryCode === 'PT';
  }

  return [
    {
      title: 'Who is the buyer of the property?',
      history: 'buyerName',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-2 p-sm-5',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'ml-0 mr-a',
          label: editForm ? 'Full Name' : 'Please fill in the full name as it is stated in your ID. Add all people who are legally buying the property, e.g. your spouse or an investment partner.',
          name: 'persons[0].fullName',
          placeholder: 'Enter full name',
          validation: [Validation.required],
          pdClass: 'py-2 py-md-5',
          large: true,
        },
      ],
    },
    {
      title: `Please give us all details about ${get(formValue, 'persons[0].fullName')}.`,
      history: 'buyerData',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-2 p-sm-5 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          classBoxWrapper: 'mt-2',
          label: 'Nationality',
          name: 'persons[0].nationality',
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          component: BrixelInputDatePicker,
          className: '',
          classNameBox: 'ml-a mr-a',
          classBoxWrapper: 'mt-2',
          ReduxFieldClass: '',
          label: 'Your date of birth',
          name: 'persons[0].dateBirth',
          showFullSelectDate: true,
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          classBoxWrapper: 'mt-2',
          component: BrixelSelect,
          label: 'Your marital status',
          name: 'persons[0].maritialStatus',
          options: factsOptions.martialStatus,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          conditionsOr: [{
            name: 'persons[0].maritialStatus',
            value: 'married',
          }, {
            name: 'persons[0].maritialStatus',
            value: 'partnership',
          }],
          classNameBox: 'ml-a mr-a',
          classBoxWrapper: 'mt-2',
          component: BrixelSelect,
          label: 'Your matrimonial property regime',
          name: 'persons[0].matrimonialPropertyRegime',
          options: isPT ? factsOptions.matrimonialPropertyRegimePT : factsOptions.matrimonialPropertyRegime,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          classWidthBox: 'w-perc-100',
          classBoxWrapper: 'mt-2',
          ReduxFieldClass: '',
          label: 'Current living address',
          name: 'persons[0].currentLivingAddress.address',
          validation: [Validation.required],
          large: true,
        },
        {
          component: BrixelInputText,
          className: '',
          classWidthBox: 'w-perc-60 w-perc-sm-40',
          classBoxWrapper: 'pr-0 pr-sm-2 mt-2',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          placeholder: 'ZIP',
          name: 'persons[0].currentLivingAddress.zipCode',
          validation: [Validation.required],
          large: true,
        },
        {
          component: BrixelInputText,
          className: '',
          classWidthBox: 'w-perc-100 w-perc-sm-60',
          classBoxWrapper: 'mt-2',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          placeholder: 'City',
          name: 'persons[0].currentLivingAddress.city',
          validation: [Validation.required],
          large: true,
        },
      ],
    },
    {
      title: `Please upload an official ID of  ${get(formValue, 'persons[0].fullName')}.`,
      history: 'location',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-2 p-sm-5 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelUploadFile,
          classNameBox: 'ml-a mr-a',
          classWidthBox: 'w-perc-100 w-perc-sm-80',
          classBoxWrapper: 'pr-0 pr-sm-2',
          ReduxFieldClass: '',
          name: 'persons[0].idenditifyCard',
          validation: [Validation.required],
          large: true,
        },
      ],
    },
    {
      hideContinueBtn: true,
      cardType: 'loadComponent',
      history: 'buyerDataResume',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-2 p-sm-5',
      footerWidth: 'max-w-fix-600',
      component: IdentificationBuyerResume,
      hideActionsButton: true,
      cardInput: [
        {
          component: BrixelInputText,
          className: '',
          classBoxWrapper: 'mt-3',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: 'Account Owner',
          name: 'bankInfo.accountOwner',
          validation: [Validation.required],
          large: true,
        },
        {
          component: BrixelInputText,
          className: '',
          classBoxWrapper: 'mt-3',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: 'IBAN',
          name: 'bankInfo.IBAN',
          validation: [Validation.required],
          large: true,
        },
      ],
    },
    {
      background: 'bgCardGreen',
      hideProgress: true,
      cardType: 'card',
      title: 'Thank you',
      img: ClipboardImg,
      imgMaxWidth: 'max-w-fix-160',
      cardClass: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-2 p-sm-5',
      subtitle: 'Thank you. We will review your inputs and get back to you.',
      history: 'success',
      vCentered: true,
      toSave: true,
      hideActionsButton: true,
    },
  ];
};
