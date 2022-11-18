/* eslint-disable max-len */
/* eslint-disable react/jsx-filename-extension */
import { FinancingCalculator } from '@brixel/brixel-components';
import get from 'lodash/get';
import ClipboardImg from '../../images/scanTrial/clipboard.png';
import BaloiseRegistration from '../../Pages/Closing/Offers/Flow/BaloiseRegistration';
import Key4Registration from '../../Pages/Closing/Offers/Flow/Key4Registration';
import { configureStore } from '../../store';
import translateTo from '../../utils/translation';

export const QuestionsList = (changeVal, changeIndex, handleSetModal, lang) => {
  let formValue = {};
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.offerFlow.values', []);
  }

  const successMessage = () => {
    switch (formValue.company) {
      case 'baloise':
        return 'We have forwarded your request. Our partner Baloise will contact you as soon as possible.'
      case 'ubs':
        return 'We have forwarded your request. Our partner UBS will contact you as soon as possible.'
      default:
        return 'We have forwarded your request. Our partner will contact you as soon as possible.'
    }
  }

  return [
    // FOR PARTNER
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
      className: 'max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100',
      footerWidth: 'max-w-fix-768',
      component: FinancingCalculator,
      country: 'CH',
      propertyPrice: formValue.propertyPrice,
      hideText: true,
      customButton: [],
      unsuccessMessage: `<h6 class="mt-3 mb-2 fweight-600">${translateTo('Note', lang)}</h6><p>${translateTo('Based on the details you have provided, financing your dream home is not quite possible yet.', lang)}</p>`,
      partner: formValue.company,
      onChangeValue: (aff, loan, affordabilityCheck, loanValueCheck, finance, price) => {
        formValue.affordability = aff;
        formValue.loanToValueRatio = loan;
        changeVal('affordabilityCheck', affordabilityCheck);
        changeVal('loanValueCheck', loanValueCheck);
        changeVal('finance', finance);
        changeVal('amount', price);
        changeVal('mortgageAmount', price - finance.equityCapital);
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
      txtAfterNextButton: translateTo('<p>I agree that my data (surname, first name, address, telephone number, e-mail) as well as the information necessary for the proof of financing (address of the property, price of the property, URL of the property, tax declaration, proof of income and pension fund statement, form authorization to obtain information) are transmitted to Baloise Bank for the purpose of requesting a proof of financing.</p><p class="mt-1">Furthermore, I authorize Baloise Bank SoBa AG to transmit the feedback on my request for proof of financing to Brixel AG and, in order to check whether I am already a customer of Baloise Bank SoBa AG, to carry out a comparison with my relevant data available at Baloise Bank SoBa AG.</p><p class="mt-1">You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing carried out on the basis of the consent until the revocation.</p>', lang),
      country: 'CH',
    },
    // ONLY FOR UBS
    {
      condition: [
        {
          name: 'company',
          value: 'ubs',
        },{
          name: 'document',
          value: null,
        },
        {
          name: 'affordabilityCheck',
          value: true,
        },
        {
          name: 'loanValueCheck',
          value: true,
        },
      ],
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
