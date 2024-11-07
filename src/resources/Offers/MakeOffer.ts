/* eslint-disable max-len */
import get from 'lodash/get';
import {FactsOptions} from '@brixel-io/brixel-components';
import {configureStore} from '../../store';
import translateTo from '../../utils/translation';
import {
  BrixelTextArea,
  BrixelSelect,
  BrixelInputText,
  Validation,
  BrixelInputPhone,
  BrixelInputDatePicker,
} from '@brixel-io/brixel-components/dist/form';
import MakeOfferPropertyCard from '../../components/Cards/MakeOfferPropertyCard';
import MakeOfferResume from '../../Pages/Dashboard/Buyer/Offer/MakeOffer/MakeOfferResume';
import SavingMoneyIcon from '@brixel-io/brixel-components/dist/images/IconsColored/general/SavingMoney.svg';
import MakeOfferUploadProofOfFinancing from '../../Pages/Dashboard/Buyer/Offer/MakeOffer/MakeOfferUploadProofFinancing';
import {DocumentType, PhoneNumberType, QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';

const { factsOptions } = FactsOptions;

export type formValueMekOffer = {
  amount: number
  currency: string
  id: string
  smallLoader?: string
  additionalBuyerInfo: {
    fullName?: string
    email?: string
    phone?: PhoneNumberType
    placeOfOrigin: string
    dateBirth: number
    maritialStatus: string
    matrimonialPropertyRegime?: string
    typeOfPurchase: string
  },
  noteByBuyer: string,
  location: {
    street: string
    streetNumber: string
    zipCode: string
    city: string
  },
  documents: DocumentType[]
}

export const QuestionsList: (lang: string) => QuestionsListType[] = (lang) => {
  let formValue: formValueMekOffer | undefined = undefined;
  let hasProofDocument = false;
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.makeOffer.values', []);
    hasProofDocument = (formValue?.documents && formValue.documents.length > 0) || false;
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
      className: 'max-w-fix-600',
      footerWidth: 'max-w-fix-600',
      cardType: 'loadComponentBeforeInput',
      hideBackArrow: true,
      component: MakeOfferPropertyCard,
      inputs: [
        {
          currency: get(formValue, 'propertyPriceCurrency', 'CHF'),
          unit: get(formValue, 'propertyPriceCurrency', 'CHF'),
          formatType: 'price',
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a mt-4',
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
          name: 'additionalBuyerInfo.typeOfPurchase',
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
      className: 'max-w-fix-600 dis-f flex-wrap a-c',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          disabled: true,
          label: translateTo('Full name', lang),
          name: 'additionalBuyerInfo.fullName',
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          component: BrixelInputText,
          classNameBox: 'ml-a mr-a',
          disabled: true,
          label: translateTo('Email', lang),
          name: 'additionalBuyerInfo.email',
          type: 'email',
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          component: BrixelInputPhone,
          name: 'additionalBuyerInfo.phone',
          label: translateTo('Phone', lang),
          disabled: true,
          large: true,
          pdClass: 'py-3 py-md-5',
        },
        {
          component: BrixelInputDatePicker,
          className: '',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: translateTo('Birth date', lang),
          name: 'additionalBuyerInfo.dateBirth',
          showFullSelectDate: true,
          large: true,
        },
        {
          classNameBox: 'ml-a mr-a',
          component: BrixelSelect,
          label: translateTo('Marital status', lang),
          name: 'additionalBuyerInfo.maritialStatus',
          options: martialStatus,
          pdClass: 'py-3 py-md-5',
          large: true,
        },
        {
          conditionsOr: [{
            name: 'additionalBuyerInfo.maritialStatus',
            value: 'married',
          }, {
            name: 'additionalBuyerInfo.maritialStatus',
            value: 'partnership',
          }],
          classNameBox: 'ml-a mr-a',
          component: BrixelSelect,
          label: translateTo('Marital property regime', lang),
          name: 'additionalBuyerInfo.matrimonialPropertyRegime',
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
          classWidthBox: 'w-perc-70',
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
          classWidthBox: 'w-perc-30',
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
          classBoxWrapper: 'pr-2 mt-3 mb-3',
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
          classBoxWrapper: 'mt-3 mb-3',
          classNameBox: 'ml-a mr-a',
          ReduxFieldClass: '',
          label: translateTo('City', lang),
          name: 'location.city',
          validation: [Validation.required],
          large: true,
        },
      ],
    },
    {
      title: translateTo('Upload your proof of financing', lang),
      subtitle: translateTo('Share a recent proof of financing from a Swiss financial institution to speed up the process. If you don’t have it yet, you can request it after submitting your offer.', lang),
      history: 'makeOffer',
      className: 'max-w-fix-600',
      footerWidth: 'max-w-fix-600',
      cardType: 'loadComponent',
      showSendButton: true,
      btnLabel: hasProofDocument ? translateTo('Next', lang) : translateTo('Skip', lang),
      component: MakeOfferUploadProofOfFinancing,
    },
    {
      hideProgress: true,
      cardType: 'loadComponent',
      component: MakeOfferResume,
      footerWidth: 'max-w-fix-600',
      showSendButton: true,
      showBackButton: true,
      btnLabel: translateTo('Submit offer', lang),
      title: translateTo('Review and submit your offer', lang),
      subtitle: translateTo('Please review the details below. If everything is correct, click "Submit offer" to finalize.', lang),
      history: 'resumeMakeOffer',
    },
    // GENERAL SAVING FUNCTION FOR EVERYONE
    {
      hideProgress: true,
      background: 'bgCardGreen',
      cardType: 'card',
      img: SavingMoneyIcon,
      imgMaxWidth: 'max-w-fix-160',
      cardClass: 'max-w-fix-360 ml-a mr-a',
      btnType: 'secondary',
      title: translateTo('Thank you!', lang),
      subtitle: translateTo('Your offer is being reviewed. We will contact you with any updates.', lang),
      history: 'success',
      successCustomButtons: [{
        type: 'secondary',
      }],
      vCentered: true,
      toSave: true,
    },
  ];
};
