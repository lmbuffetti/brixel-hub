/* eslint-disable max-len */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  BrixelRadioButton,
  BrixelInputText,
  BrixelInputTextStep,
  Validation,
  BrixelInputDatePicker,
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
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.offerFlow.values', []);
    const countryCode = get(formValue, 'propertyLocation.countryCode', '');
    isPT = countryCode === 'PT';
  }

  const TextForm = () => {
    const sendData = () => {
      changeVal('financeCertificate', 0);
      changeIndex(1);
    };
    return (
      <p>
        <span>You don&apos;t have a proof of financing yet?</span>
        <button type="button" onClick={() => sendData()}>
          <span>Apply now on key4</span>
        </button>
      </p>
    );
  };

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
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          label: 'Your place of origin',
          name: 'buyer.placeOfOrigin',
          pdClass: 'py-3 py-md-5',
        },
        {
          component: BrixelInputDatePicker,
          className: '',
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          ReduxFieldClass: '',
          label: 'Your date of birth',
          name: 'buyer.dateBirth',
          showFullSelectDate: true,
        },
        {
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          component: BrixelSelect,
          label: 'Your marital status',
          name: 'buyer.maritialStatus',
          options: factsOptions.martialStatus,
          pdClass: 'py-3 py-md-5',
        },
        {
          conditionsOr: [{
            name: 'buyer.maritialStatus',
            value: 'married',
          }, {
            name: 'buyer.maritialStatus',
            value: 'partnership',
          }],
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          component: BrixelSelect,
          label: 'Your matrimonial property regime',
          name: 'buyer.matrimonialPropertyRegime',
          options: isPT ? factsOptions.matrimonialPropertyRegimePT : factsOptions.matrimonialPropertyRegime,
          pdClass: 'py-3 py-md-5',
        },
        {
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          component: BrixelSelect,
          label: 'Type of purchase',
          name: 'buyer.typeOfPurchase',
          options: isPT ? factsOptions.purchaseTypePT : factsOptions.purchaseType,
          pdClass: 'py-3 py-md-5',
        },
        {
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          component: BrixelTextArea,
          label: 'Comment',
          placeholder: 'Add an amount of your down payment and the date you would like to sign the contract and deed.',
          name: 'noteByBuyer',
          pdClass: 'py-3 py-md-5',
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
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5 dis-f flex-wrap',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          classWidthBox: 'w-perc-100 w-perc-md-90',
          classBoxWrapper: 'pr-2',
          ReduxFieldClass: '',
          label: 'Street',
          name: 'location.street',
          validation: [Validation.required],
        },
        {
          component: BrixelInputText,
          classBoxWrapper: 'mt-0 w-perc-10',
          classWidthBox: 'w-perc-100 w-perc-md-10',
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          ReduxFieldClass: '',
          label: 'Nr',
          name: 'location.streetNumber',
        },
        {
          component: BrixelInputText,
          className: '',
          classWidthBox: 'w-perc-100 w-perc-md-40',
          classBoxWrapper: 'pr-1 mt-5',
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          ReduxFieldClass: '',
          label: 'Zip',
          name: 'location.zipCode',
          validation: [Validation.required],
        },
        {
          component: BrixelInputText,
          className: '',
          classWidthBox: 'w-perc-100 w-perc-md-60',
          classBoxWrapper: 'pl-1 mt-5',
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          ReduxFieldClass: '',
          label: 'City',
          name: 'location.City',
          validation: [Validation.required],
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
      title: 'Add a proof of financing by a Swiss financial institution',
      history: 'financingProof',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5 dis-f flex-wrap',
      inputs: [
        {
          component: BrixelMultiUploadFile,
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          classBoxWrapper: 'pr-2',
          ReduxFieldClass: '',
          label: 'Add a proof of financing by a Swiss financial institution\n',
          name: 'document',
          validation: [Validation.required],
        },
        {
          customComponent: isPT ? null : TextForm,
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          classBoxWrapper: 'pr-2',
          ReduxFieldClass: '',
          label: 'Add a proof of financing by a Swiss financial institution\n',
          name: 'document',
        },
      ],
    },

    {
      condition: [{
        name: 'financeCertificate',
        value: 0,
      }],
      hideActionsButton: true,
      cardType: 'loadComponent',
      history: 'financeCertificate',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5',
      component: FinanceCertificate,
    },
    {
      condition: [{
        name: 'financeCertificate',
        value: 0,
      }],
      title: 'Please enter your financial data',
      history: 'financialData',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5',
      inputs: [
        {
          customHTML: 'These data are needed to apply for your financing certificate. Brixel is not saving any of your financial data.',
        },
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          component: BrixelInputText,
          classNameBox: 'max-w-fix-816 ml-a mr-a',
          label: 'Your equity capital',
          name: 'financeBuyer.equity',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
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
      hideActionsButton: true,
      cardType: 'loadComponent',
      history: 'key4Registration',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite p-5',
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
