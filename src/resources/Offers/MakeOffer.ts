/* eslint-disable max-len */
import get from 'lodash/get';
import {FactsOptions} from '@brixel-io/brixel-components';
import {configureStore} from '../../store';
import translateTo from '../../utils/translation';
import ProofOfFinancingThankYou from '../../Pages/Dashboard/Buyer/Offer/ProofOfFinancing/ProofOfFIinancingThankYou';
import DocumentFullIcon from '../../images/documentsIcon/documentFull.svg';
import {
  BrixelTextArea,
  BrixelSelect,
  BrixelInputText,
  Validation,
  BrixelInputPhone,
  BrixelInputDatePicker,
} from '@brixel-io/brixel-components/dist/form';
import MakeOfferPropertyCard from '../../Pages/Dashboard/Buyer/Offer/MakeOffer/MakeOfferPropertyCard';
import MakeOfferUploadProofOfFinancing from '../../Pages/Dashboard/Buyer/Offer/MakeOffer/MakeOfferUploadProofFinancing';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';

export type formValueType = {
  proofOfFinancing?: File[]
}

const { factsOptions } = FactsOptions;

export const QuestionsList: (lang: string) => QuestionsListType[] = (lang) => {
  let formValue: formValueType = {};
  let hasProofDocument = false;
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.makeOffer.values', []);
    hasProofDocument = (formValue.proofOfFinancing && formValue.proofOfFinancing.length > 0) || false;
  }

  const purchaseType = factsOptions.purchaseType.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));

  const martialStatus = factsOptions.martialStatus.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));

  const matrimonialPropertyRegime = factsOptions.matrimonialPropertyRegime.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));

  return [
    {
      title: translateTo('Make an offer', lang),
      subtitle: translateTo('Fill out the offer form with your proposed price and personal details.', lang),
      history: 'makeOffer',
      className: 'max-w-fix-768',
      footerWidth: 'max-w-fix-768',
      cardType: 'loadComponentBeforeInput',
      hideBackArrow: true,
      component: MakeOfferPropertyCard,
      inputs: [
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          label: translateTo('Your offer', lang),
          name: 'amount',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelSelect,
          label: translateTo('Type of purchase', lang),
          name: 'buyer.typeOfPurchase',
          options: purchaseType,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelTextArea,
          label: translateTo('Add a comment (optional)', lang),
          placeholder: translateTo('Add here relevant information regarding your offer, such as special conditions, requests, dates, etc', lang),
          name: 'noteByBuyer',
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          className: 'mt-3',
          name: 'tooltipText',
          type: 'tooltipText',
          title: translateTo('This is a non-binding offer', lang),
          text: translateTo('This offer does not create any legal obligations and serves as a preliminary proposal. Final terms may change after further discussion.', lang),
        },
      ],
    },
    {
      title: translateTo('Your personal details', lang),
      subtitle: translateTo('Add your personal information to complete your offer.', lang),
      history: 'buyerInformation',
      className: 'max-w-fix-768 dis-f flex-wrap a-c',
      footerWidth: 'max-w-fix-768',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          label: translateTo('Full name', lang),
          name: 'buyer.fullName',
          validation: [Validation.required],
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          label: translateTo('Email', lang),
          name: 'buyer.email',
          type: 'email',
          validation: [Validation.required, Validation.isEmail],
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          component: BrixelInputPhone,
          name: 'buyer.phone',
          label: translateTo('Phone', lang),
          large: true,
          pdClass: 'py-3 py-md-5',
          validation: [Validation.required],
        },
        {
          component: BrixelInputDatePicker,
          className: '',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: translateTo('Birth date', lang),
          name: 'buyer.dateBirth',
          showFullSelectDate: true,
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelSelect,
          label: translateTo('Marital status', lang),
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
          label: translateTo('Marital property regime', lang),
          name: 'buyer.matrimonialPropertyRegime',
          options: matrimonialPropertyRegime,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          name: 'seperator',
          type: 'separator',
          showLine: true,
          title: translateTo('Your living address', lang),
        },
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          classWidthBox: 'w-perc-80',
          classBoxWrapper: 'pr-2',
          ReduxFieldClass: '',
          label: translateTo('Street name', lang),
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
          label: translateTo('Street number', lang),
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
      title: translateTo('Upload your proof of financing', lang),
      subtitle: translateTo('Share the proof of financing from a Swiss financial institution to speed up the process. Don’t have it yet? You can request it after submitting your offer.', lang),
      history: 'makeOffer',
      className: 'max-w-fix-768',
      footerWidth: 'max-w-fix-768',
      cardType: 'loadComponent',
      showSendButton: true,
      btnLabel: hasProofDocument ? translateTo('Next', lang) : translateTo('Skip', lang),
      component: MakeOfferUploadProofOfFinancing,
    },
    // GENERAL SAVING FUNCTION FOR EVERYONE
    {
      background: 'bgCardGreen',
      hideProgress: true,
      cardType: 'loadComponent',
      component: ProofOfFinancingThankYou,
      titleIcon: DocumentFullIcon,
      imgMaxWidth: 'max-w-fix-160',
      showSendButton: false,
      cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
      title: translateTo('Unfortunately, you\'re not eligible for a proof of financing at this time. Our property experts are here to help you, feel free to contact us.', lang),
      history: 'success',
      vCentered: true,
      toSave: true,
    },
  ];
};
