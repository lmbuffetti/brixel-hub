/* eslint-disable max-len */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { FactsOptions, translateTo, FinancingCalculator } from '@brixel/brixel-components';
import {
  BrixelRadioButton,
  BrixelInputText,
  BrixelInputDatePicker,
  BrixelInputTextStep,
  Validation,
  BrixelSelect,
  BrixelTextArea,
  BrixelMultiUploadFile,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import FinanceCertificate from '../../Pages/Offers/Flow/FinanceCertificate';
import Key4Registration from '../../Pages/Offers/Flow/Key4Registration';
import BaloiseRegistration from '../../Pages/Offers/Flow/BaloiseRegistration';
import ClipboardImg from '../../images/scanTrial/clipboard.png';
import { configureStore } from '../../store';
import BaloiseLogoImg from '../../images/Companies/Baloise/BaloiseLogo.svg';
import UBSLogoImg from '../../images/Companies/ubsKey4/ubsLogo.svg';
import Key4LogoImg from '../../images/Companies/ubsKey4/key4Logo.svg';

const { factsOptions } = FactsOptions;

export const MakeOfferQuestions = (changeVal, changeIndex, handleSetModal, lang) => {
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
  
  const martialStatus = factsOptions.martialStatus.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const matrimonialPropertyRegimePT = factsOptions.matrimonialPropertyRegimePT.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const matrimonialPropertyRegime = factsOptions.matrimonialPropertyRegime.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const purchaseTypePT = factsOptions.purchaseTypePT.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const purchaseType = factsOptions.purchaseType.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));

  const TextForm = () => {
    const sendData = () => {
      changeVal('financeCertificate', 0);
      changeIndex(1);
    };
    return (
      <>
        <hr className="bgAltGrey200" />
        <p className="txtDark700 fsize-500 p-5">
          <span>{translateTo('You don&apos;t have a proof of financing yet?', lang)}</span>
          <span className="cur-poi dis-b td-u" type="button" onClick={() => sendData()}>
            <span>{translateTo('Apply now on key4', lang)}</span>
          </span>
        </p>
      </>
    );
  };
  
  const successMessage = () => {
    switch (formValue.company) {
      case 'baloise':
        return 'Your offer has been sent to the seller and will be reviewed by us. You will be informed as soon as possible.'
      case 'ubs_key4':
        return 'Your offer has been sent to the seller and will be reviewed by us. You will be informed as soon as possible.'
      default:
        return 'Your offer has been submitted to the seller and is currently pending. The seller will get back to you.'
    }
  }
  
  const TextPartnerUpload = () => {
    return (
      <>
        {
          get(formValue, 'document', []).length === 0 && (
            <div className="bgWhit w-perc-100 mt-3 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-5">
              <div className="txtDark700">
                <h6 className="mb-3 fweight-600">
                  {translateTo('No. Order a proof of financing here.', lang)}
                </h6>
                <span>
                  {translateTo('No problem. Our partner Baloise will provide you with a financing certificate free of charge. This is a non-binding offer.', lang)}
                </span>
  
                {
                  formValue.company === 'baloise' && (
                    <div className="dis-f a-c mt-3">
                      <p className="txtAltGrey400 mr-2">In partnership with</p>
                      <img src={BaloiseLogoImg} alt="Logo Baloise" />
                    </div>
                  )
                }
  
                {
                  formValue.company === 'ubs_key4' && (
                    <div className="dis-f a-c mt-3">
                      <p className="txtAltGrey400 mr-2">In partnership with</p>
                      <img src={UBSLogoImg} alt="Logo UBS" />
                      <img className="ml-2" src={Key4LogoImg} alt="Logo Key 4" />
                    </div>
                  )
                }
      
              </div>
            </div>
          )
        }
      </>
    );
  };

  return [
    {
      title: translateTo('Set your price', lang),
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
          label: translateTo('Listing price', lang),
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
          label: translateTo('Your offer', lang),
          name: 'amount',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          condition: [
            {
              name: 'company',
              noValue: 'baloise',
            },
            {
              name: 'company',
              noValue: 'ubs_key4',
            }
          ],
          component: BrixelRadioButton,
          label: translateTo('Do you already have a financing certificate?', lang),
          name: 'financeCertificate',
          large: true,
          validation: [Validation.required],
          options: [{
            value: 1,
            label: translateTo('Yes', lang),
          }, {
            value: 0,
            label: translateTo('No', lang),
          }],
          tooltip: {
            label: translateTo('What is a proof of financing?', lang),
            description: translateTo('A proof of financing (also called financing certificate) is a non-binding assessment of your financial situation. You can use it to prove to us that you can afford the house or apartment.', lang),
          },
        },
      ],
    },
    // FOR COMPANIES AND NOT FOR PARTNER
    {
      condition: [{
        name: 'financeCertificate',
        value: 1,
      }],
      title: translateTo('Please tell us some more details', lang),
      history: 'analysis',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          label: translateTo('Your place of origin', lang),
          name: 'buyer.placeOfOrigin',
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          component: BrixelInputDatePicker,
          className: '',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: translateTo('Your date of birth', lang),
          name: 'buyer.dateBirth',
          showFullSelectDate: true,
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelSelect,
          label: translateTo('Your marital status', lang),
          name: 'buyer.maritialStatus',
          options: martialStatus,
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
          label: translateTo('Your matrimonial property regime', lang),
          name: 'buyer.matrimonialPropertyRegime',
          options: isPT ? matrimonialPropertyRegimePT : matrimonialPropertyRegime,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelSelect,
          label: translateTo('Type of purchase', lang),
          name: 'buyer.typeOfPurchase',
          options: isPT ? purchaseTypePT : purchaseType,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelTextArea,
          label: translateTo('Comment', lang),
          placeholder: translateTo('Add an amount of your down payment and the date you would like to sign the contract and deed.', lang),
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
      title: translateTo('Where do you currently live?', lang),
      history: 'location',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          classWidthBox: 'w-perc-80',
          classBoxWrapper: 'pr-2',
          ReduxFieldClass: '',
          label: translateTo('Street', lang),
          name: 'location.street',
          validation: [Validation.required],
          large: true,
        },
        {
          component: BrixelInputText,
          classBoxWrapper: 'pr-0 mt-0',
          classWidthBox: 'w-perc-20',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: translateTo('Nr', lang),
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
          label: translateTo('Zip', lang),
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
          label: translateTo('City', lang),
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
      title: translateTo('Upload your proof of financing', lang),
      history: 'financingProof',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelMultiUploadFile,
          classNameBox: 'max-w-fix-600 ml-a mr-a',
          classBoxWrapper: 'p-5',
          ReduxFieldClass: '',
          label: translateTo(`Add a proof of financing by ${countryName} financial institution`, lang),
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
      title: translateTo('Please enter your financial data', lang),
      history: 'financialData',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          customHTML: `<p class="fsize-300 txtDark700">${translateTo('These data are needed to apply for your financing certificate. Brixel is not saving any of your financial data.', lang)}</p>`,
        },
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          label: translateTo('Your equity capital', lang),
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
              title: translateTo('What is the equity capital?', lang),
              body: `<p>${translateTo('This is the money you can contribute to the mortgage. It may come from savings, private pensions, occupational pension funds, inheritance etc. Lenders generally require a deposit of at least 20% of the price.', lang)}</p>`,
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
          label: translateTo('Your gross annual income', lang),
          name: 'financeBuyer.income',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
          modal: {
            message: 'info',
            info: true,
            func: () => handleSetModal({
              state: true,
              small: true,
              title: translateTo('What is the gross annual income?', lang),
              body: `<p>${translateTo('This is the income of your household before deduction of social contributions, including 13th month salary and other salary components (e.g. bonuses).', lang)}</p>`,
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
    // FOR PARTNER
    {
      condition: [{
        name: 'financeCertificate',
        value: null,
      }],
      title: translateTo('Do you have a recent proof of financing?', lang),
      subtitle: translateTo('Do you have a recent proof of financing?', lang),
      history: 'financingProof',
      className: 'max-w-fix-600 ml-a mr-a dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelMultiUploadFile,
          topLabel: translateTo('Yes. Then upload it here directly.', lang),
          topLabelClass: 'mb-3 fweight-600',
          classNameBox: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-5',
          classBoxWrapper: '',
          ReduxFieldClass: '',
          label: translateTo(`Add a proof of financing from a ${countryName} financial institution`, lang),
          name: 'document',
          theme: 'simple',
          acceptedFile: ['jpg', 'png', 'application/pdf'],
        },
        {
          customComponent: TextPartnerUpload,
          classNameBox: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-5',
          classBoxWrapper: 'mt-3',
          ReduxFieldClass: '',
          name: 'document',
        },
      ],
    },
    {
      condition: [
        {
          name: 'financeCertificate',
          value: null,
        },
        {
          name: 'document',
          value: null,
        }],
      cardType: 'loadComponent',
      history: 'financeCalculator',
      className: 'ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      component: FinancingCalculator,
      country: 'CH',
      propertyPrice: formValue.propertyPrice,
      hideText: true,
      customButton: [],
      partner: formValue.company,
      onChangeValue: (aff, loan, affordabilityCheck, loanValueCheck) => {
        formValue.affordability = aff;
        formValue.loanToValueRatio = loan;
        changeVal('affordabilityCheck', affordabilityCheck),
        changeVal('loanValueCheck', loanValueCheck)
      }
    },
    // ONLY FOR BALOISE
    {
      condition: [
        {
          name: 'affordabilityCheck',
          value: true,
        },
        {
          name: 'loanValueCheck',
          value: true,
        },
        {
          name: 'company',
          value: 'baloise',
        },
      ],
      cardType: 'loadComponent',
      history: 'uploadDocumentsBaloise',
      className: 'ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      component: BaloiseRegistration,
      country: 'CH',
    },
    // ONLY FOR UBS_KEY4
    {
      condition: [{
        name: 'company',
        value: 'ubs_key4',
      }],
      hideContinueBtn: true,
      cardType: 'loadComponent',
      history: 'key4Registration',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      component: Key4Registration,
    },
    // GENERAL SAVING FUNCTION FOR EVERYONE
    {
      background: 'bgCardGreen',
      hideProgress: true,
      cardType: 'card',
      title: translateTo('Thank you', lang),
      img: ClipboardImg,
      imgMaxWidth: 'max-w-fix-160',
      cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
      subtitle: translateTo(successMessage(), lang),
      history: 'success',
      vCentered: true,
      toSave: true,
    },
  ];
};
