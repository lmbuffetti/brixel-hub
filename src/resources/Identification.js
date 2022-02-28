/* eslint-disable max-len */
/* eslint-disable react/jsx-filename-extension */
import {
  BrixelUploadFile,
  BrixelInputText,
  BrixelInputDatePicker,
  // Validation,
  FactsOptions,
  BrixelSelect, Validation,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import ClipboardImg from '../images/scanTrial/clipboard.png';
// eslint-disable-next-line import/no-cycle
import IdentificationBuyerResume from '../Pages/Closing/Identification/IdentificationBuyerResume';
import { configureStore } from '../store';

const { factsOptions } = FactsOptions;

export const IdentificationQuestions = (editForm = false, userType) => {
  let formValue = {};
  let isPT;
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.Identification.values', []);
    const countryCode = get(formValue, 'propertyLocation.countryCode', '');
    isPT = countryCode === 'PT';
  }

  return [
    {
      title: `Who is the ${userType} of the property?`,
      history: 'buyerName',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5',
      subtitleSmall: `Please fill in the full name as it is stated in your ID. Add all people who are legally ${userType === 'seller' ? 'selling' : 'buying'}  the property, e.g. your spouse or an investment partner.`,
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'ml-0 mr-a',
          label: editForm ? 'Full Name' : 'Name',
          name: 'persons[0].fullName',
          placeholder: 'Enter full name',
          pdClass: 'py-2 py-md-5',
          validation: [Validation.required],
          large: true,
        },
      ],
    },
    {
      title: `<span>Please give us all details about</span><span class="ml-small-4">${get(formValue, 'persons[0].fullName')}.</span>`,
      history: 'buyerData',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5 dis-f flex-wrap',
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
          validation: [Validation.required],
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
          validation: [Validation.required],
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
          validation: [Validation.required],
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
          classNameBox: 'ml-a mr-a',
          classBoxWrapper: 'mt-2',
          component: BrixelSelect,
          label: 'Type of ownership',
          name: 'persons[0].typeOfOwnership',
          options: isPT ? factsOptions.purchaseTypePT : factsOptions.purchaseType,
          pdClass: 'py-3 py-md-5',
          large: true,
          validation: [Validation.required],
        },
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          classWidthBox: 'w-perc-100',
          classBoxWrapper: 'mt-2',
          ReduxFieldClass: '',
          label: 'Current living address',
          name: 'persons[0].currentLivingAddress.address',
          large: true,
          validation: [Validation.required],
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
          large: true,
          validation: [Validation.required],
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
          large: true,
          validation: [Validation.required],
        },
      ],
    },
    {
      title: `<span>Please upload an official ID of</span><span class="ml-small-4">${get(formValue, 'persons[0].fullName')}.</span>`,
      history: 'document',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelUploadFile,
          classNameBox: '',
          classWidthBox: 'w-perc-100',
          label: 'Front',
          classBoxWrapper: '',
          labelIcon: true,
          ReduxFieldClass: 'dis-f',
          name: 'persons[0].document[0]',
          large: true,
        },
        {
          component: BrixelUploadFile,
          classNameBox: '',
          classWidthBox: 'w-perc-100',
          classBoxWrapper: '',
          label: 'Back',
          labelIcon: true,
          ReduxFieldClass: 'dis-f',
          name: 'persons[0].document[1]',
          large: true,
        },
      ],
    },
    {
      hideContinueBtn: true,
      cardType: 'loadComponent',
      history: 'buyerDataResume',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5',
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
          large: true,
          validation: [Validation.required],
        },
        {
          component: BrixelInputText,
          className: '',
          classBoxWrapper: 'mt-3',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: 'IBAN',
          name: 'bankInfo.IBAN',
          large: true,
          validation: [Validation.isValidIban, Validation.required],
        },
      ],
    },
    {
      background: 'bgGreen100',
      hideProgress: true,
      cardType: 'card',
      title: 'Thank you',
      img: ClipboardImg,
      imgMaxWidth: 'max-w-fix-152',
      cardClass: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5',
      subtitle: 'Your data was transmitted. We will review your inputs and get back to you.',
      history: 'success',
      vCentered: true,
      toSave: true,
      hideActionsButton: true,
    },
  ];
};
