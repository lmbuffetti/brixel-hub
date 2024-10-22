/* eslint-disable max-len */
import {FinancingCalculator} from '@brixel-io/brixel-components';
import get from 'lodash/get';
import {configureStore} from '../../store';
import translateTo from '../../utils/translation';
import ProofOfFinancingTermsCondition from '../../Pages/Dashboard/Buyer/Offer/ProofOfFinancing/ProofOfFinancingTermsCondition';
import ProofOfFinancingThankYou from '../../Pages/Dashboard/Buyer/Offer/ProofOfFinancing/ProofOfFIinancingThankYou';
import DocumentFullIcon from '../../images/documentsIcon/documentFull.svg';
import CheckIcon from '@brixel-io/brixel-components/dist/images/IconsColored/checkIcon.svg';

export type formValueType = {
  affordability?: string;
  affordabilityCheck?: boolean;
  loanValueCheck?: boolean;
  company?: string;
  loanToValueRatio?: string;
  propertyPrice?: string;
}

export const QuestionsList = (changeVal, lang) => {
  let formValue: formValueType = {};
  let isElegible = false;
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.ProofOfFinancing.values', []);
    isElegible = (formValue.affordabilityCheck && formValue?.loanValueCheck) || false;
  }

  return [
    // FOR PARTNER
    {
      title: translateTo('Please indicate your financial resources', lang),
      subtitle: translateTo('To help us better understand your financial situation, please provide the following information. This will assist in determining if you qualify for financing.', lang),
      cardType: 'loadComponent',
      history: 'financeCalculator',
      className: 'max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdText50',
      footerWidth: 'max-w-fix-768',
      component: FinancingCalculator,
      lang: lang,
      country: 'CH',
      isOffer: true,
      propertyPrice: formValue.propertyPrice,
      hideText: true,
      customButton: [],
      hideBackArrow: true,
      showSendButton: true,
      btnLabel: translateTo('Next', lang),
      unsuccessMessage: `<p>${translateTo('Based on the details you have provided, financing your dream home is not quite possible yet.', lang)}</p>`,
      successMessage: `<p>${translateTo('Based on the details you have provided, financing your dream home is possible.', lang)}</p>`,
      showMsgOnTop: true,
      partner: formValue.company,
      onChangeValue: (aff, loan, affCheck, loanCheck, finance, price) => {
        formValue.affordability = aff;
        formValue.loanToValueRatio = loan;
        changeVal('affordabilityCheck', affCheck);
        changeVal('loanValueCheck', loanCheck);
        changeVal('finance', finance);
        changeVal('amount', price);
        changeVal('mortgageAmount', price - finance.equityCapital);
      },
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
      ],
      title: translateTo('Your details will be forwarded to Baloise/UBS', lang),
      subtitle: translateTo('We will forward your details to an advisor. You will be contacted shortly.', lang),
      showSendButton: true,
      cardType: 'loadComponent',
      component: ProofOfFinancingTermsCondition,
      btnLabel: translateTo('Accept and submit', lang),
      history: 'proofFinancingTermsCondition',
      className: 'max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-3 p-sm-5',
      footerWidth: 'max-w-fix-768',
    },
    // GENERAL SAVING FUNCTION FOR EVERYONE
    {
      background: 'bgCardGreen',
      hideProgress: true,
      cardType: 'loadComponent',
      component: ProofOfFinancingThankYou,
      titleIcon: isElegible ? CheckIcon : DocumentFullIcon,
      imgMaxWidth: 'max-w-fix-160',
      showSendButton: false,
      cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
      title: isElegible ? translateTo('Thank you for applying!', lang) : translateTo('Thank you!', lang),
      subtitle: isElegible ? translateTo('Your details will be forwarded to an advisor. They will contact you shortly to assist you further.', lang) : translateTo('Unfortunately, you\'re not eligible for a proof of financing at this time. Our property experts are here to help you, feel free to contact us.', lang),
      history: 'success',
      vCentered: true,
      toSave: true,
    },
  ];
};
