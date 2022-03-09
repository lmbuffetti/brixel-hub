/* eslint-disable max-len */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  BrixelRadioButton,
  BrixelInputText,
  BrixelInputDatePicker,
  BrixelInputTextStep,
  Validation,
  FactsOptions,
  BrixelSelect,
  BrixelTextArea,
  BrixelMultiUploadFile,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import FinanceCertificate from '../Pages/Offers/Flow/FinanceCertificate';
import Key4Registration from '../Pages/Offers/Flow/Key4Registration';
import ClipboardImg from '../images/scanTrial/clipboard.png';
import { configureStore } from '../store';

const { factsOptions } = FactsOptions;

export const MakeOfferQuestions = (changeVal, changeIndex, handleSetModal) => {
  let formValue = {};
  let isPT;
  let countryName = '';
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.offerFlow.values', []);
    const countryCode = get(formValue, 'propertyLocation.countryCode', '');
    isPT = countryCode === 'PT';
    if (isPT) countryName = 'a Portuguese';
    if (countryCode === 'CH') countryName = 'a Swiss';
  }

  const TextForm = () => {
    const sendData = () => {
      changeVal('financeCertificate', 0);
      changeIndex(1);
    };
    return (
      <>
        <hr className="bgAltGrey200" />
        <p className="txtDark700 fsize-500 p-5">
          <span>You don&apos;t have a proof of financing yet?</span>
          <span className="cur-poi dis-b td-u" type="button" onClick={() => sendData()}>
            <span>Apply now on key4</span>
          </span>
        </p>
      </>
    );
  };

  return [
    {
      title: 'Set your price',
      history: 'priceInfo',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      inputs: [
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          disabled: true,
          component: BrixelInputText,
          classNameBox: 'ml-0 mr-a pr-10',
          label: 'Listing price',
          name: 'propertyPrice',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          component: BrixelInputTextStep,
          classNameBox: 'ml-a mr-a',
          label: 'Your offer',
          name: 'amount',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          component: BrixelRadioButton,
          label: 'Do you already have a financing certificate?',
          name: 'financeCertificate',
          large: true,
          validation: [Validation.required],
          options: [{
            value: 1,
            label: 'Yes',
          }, {
            value: 0,
            label: 'No',
          }],
          modal: {
            message: 'info',
            info: true,
            func: () => handleSetModal({
              state: true,
              small: true,
              title: 'What is a proof of financing?',
              body: '<p>A proof of financing (also called financing certificate) is a non-binding assessment of your financial situation. You can use it to prove to us that you can afford the house or apartment.</p>',
            }),
          },
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
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          label: 'Your place of origin',
          name: 'buyer.placeOfOrigin',
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          component: BrixelInputDatePicker,
          className: '',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: 'Your date of birth',
          name: 'buyer.dateBirth',
          showFullSelectDate: true,
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelSelect,
          label: 'Your marital status',
          name: 'buyer.maritialStatus',
          options: factsOptions.martialStatus,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          conditionsOr: [{
            name: 'buyer.maritialStatus',
            value: 'married',
          }, {
            name: 'buyer.maritialStatus',
            value: 'partnership',
          }],
          classNameBox: 'ml-a mr-a',
          component: BrixelSelect,
          label: 'Your matrimonial property regime',
          name: 'buyer.matrimonialPropertyRegime',
          options: isPT ? factsOptions.matrimonialPropertyRegimePT : factsOptions.matrimonialPropertyRegime,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelSelect,
          label: 'Type of purchase',
          name: 'buyer.typeOfPurchase',
          options: isPT ? factsOptions.purchaseTypePT : factsOptions.purchaseType,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelTextArea,
          label: 'Comment',
          placeholder: 'Add an amount of your down payment and the date you would like to sign the contract and deed.',
          name: 'noteByBuyer',
          pdClass: 'py-3 py-md-5',
          large: true,
        },
      ],
    },
    {
      condition: [{
        name: 'financeCertificate',
        value: 1,
      }],
      title: 'Where do you currently live?',
      history: 'location',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          classWidthBox: 'w-perc-100 w-perc-sm-80',
          classBoxWrapper: 'pr-0 pr-sm-2',
          ReduxFieldClass: '',
          label: 'Street',
          name: 'location.street',
          validation: [Validation.required],
          large: true,
        },
        {
          component: BrixelInputText,
          classBoxWrapper: 'mt-3 pr-2 pr-sm-0 mt-sm-0',
          classWidthBox: 'w-perc-40 w-perc-sm-20',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: 'Nr',
          name: 'location.streetNumber',
          large: true,
        },
        {
          component: BrixelInputText,
          className: '',
          classWidthBox: 'w-perc-40',
          classBoxWrapper: 'pr-2 mt-3',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: 'Zip',
          name: 'location.zipCode',
          validation: [Validation.required],
          large: true,
        },
        {
          component: BrixelInputText,
          className: '',
          classWidthBox: 'w-perc-60',
          classBoxWrapper: 'mt-3',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: 'City',
          name: 'location.City',
          validation: [Validation.required],
          large: true,
        },
      ],
    },
    {
      condition: [
        {
          name: 'financeCertificate',
          value: 1,
        },
        {
          name: 'noDocument',
          value: 0,
        },
      ],
      title: 'Upload your proof of financing',
      history: 'financingProof',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelMultiUploadFile,
          classNameBox: 'max-w-fix-600 ml-a mr-a',
          classBoxWrapper: 'p-5',
          ReduxFieldClass: '',
          label: `Add a proof of financing by ${countryName} financial institution`,
          name: 'document',
          theme: 'simple',
          validation: [Validation.required],
        },
        {
          customComponent: isPT ? null : TextForm,
          classNameBox: 'max-w-fix-600 ml-a mr-a',
          classBoxWrapper: 'py-5 ',
          ReduxFieldClass: '',
          name: 'document',
        },
      ],
    },
    {
      condition: [{
        name: 'financeCertificate',
        value: 0,
      }],
      cardType: 'loadComponent',
      history: 'financeCertificate',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      component: FinanceCertificate,
      hideContinueBtn: true,
    },
    {
      condition: [{
        name: 'financeCertificate',
        value: 0,
      }],
      showBackButton: true,
      title: 'Please enter your financial data',
      history: 'financialData',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          customHTML: '<p class="fsize-300 txtDark700">These data are needed to apply for your financing certificate. Brixel is not saving any of your financial data.</p>',
        },
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          label: 'Your equity capital',
          name: 'financeBuyer.equity',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
          large: true,
          modal: {
            message: 'info',
            info: true,
            func: () => handleSetModal({
              state: true,
              small: true,
              title: 'What is the equity capital?',
              body: '<p>This is the money you can contribute to the mortgage. It may come from savings, private pensions, occupational pension funds, inheritance etc. Lenders generally require a deposit of at least 20% of the price.</p>',
            }),
          },
        },
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          component: BrixelInputText,
          large: true,
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          label: 'Your gross annual income',
          name: 'financeBuyer.income',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
          modal: {
            message: 'info',
            info: true,
            func: () => handleSetModal({
              state: true,
              small: true,
              title: 'What is the gross annual income?',
              body: '<p>This is the income of your household before deduction of social contributions, including 13th month salary and other salary components (e.g. bonuses).</p>',
            }),
          },
        },
      ],
    },
    {
      condition: [{
        name: 'financeCertificate',
        value: 0,
      }],
      hideContinueBtn: true,
      cardType: 'loadComponent',
      history: 'key4Registration',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      component: Key4Registration,
    },
    {
      background: 'bgCardGreen',
      hideProgress: true,
      cardType: 'card',
      title: 'Thank you',
      img: ClipboardImg,
      imgMaxWidth: 'max-w-fix-160',
      cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
      subtitle: 'Your offer has been submitted to the seller and is currently pending. The seller will get back to you.',
      history: 'success',
      vCentered: true,
      toSave: true,
    },
  ];
};
