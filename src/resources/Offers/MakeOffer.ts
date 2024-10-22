/* eslint-disable max-len */
import get from 'lodash/get';
import {configureStore} from '../../store';
import translateTo from '../../utils/translation';
import ProofOfFinancingTermsCondition from '../../Pages/Dashboard/Buyer/Offer/ProofOfFinancing/ProofOfFinancingTermsCondition';
import ProofOfFinancingThankYou from '../../Pages/Dashboard/Buyer/Offer/ProofOfFinancing/ProofOfFIinancingThankYou';
import DocumentFullIcon from '../../images/documentsIcon/documentFull.svg';
import CheckIcon from '@brixel-io/brixel-components/dist/images/IconsColored/checkIcon.svg';
import {BrixelCheckbox, Validation} from '@brixel-io/brixel-components/dist/form';
import {svgIcons} from '../Utilities/svgIcons';
import MakeOfferPropertyCard from '../../Pages/Dashboard/Buyer/Offer/MakeOffer/MakeOfferPropertyCard';

export type formValueType = {
  affordability?: string;
  affordabilityCheck?: boolean;
  loanValueCheck?: boolean;
  company?: string;
  loanToValueRatio?: string;
  propertyPrice?: string;
}

export const QuestionsList = (_changeVal, lang) => {
  let formValue: formValueType = {};
  let isElegible = false;
  if (configureStore) {
    formValue = get(configureStore.getState(), 'brixelForm.ProofOfFinancing.values', []);
    isElegible = (formValue.affordabilityCheck && formValue?.loanValueCheck) || false;
  }

  return [
    // FOR PARTNER
    {
      title: translateTo('Make an offer', lang),
      subtitle: translateTo('Fill out the offer form with your proposed price and personal details.', lang),
      history: 'makeOffer',
      className: '',
      footerWidth: 'max-w-fix-768',
      cardType: 'loadComponentBeforeInput',
      component: MakeOfferPropertyCard,
      inputs: [
        {
          component: BrixelCheckbox,
          className: 'radioBtnImg',
          ReduxFieldClass: '',
          classNameBox: 'max-w-fix-880 ml-a mr-a',
          label: '',
          name: 'characteristics.propertyType',
          validation: [Validation.required],
          icons: true,
          cardLayout: true,
          cardSmall: true,
          svgSupport: true,
          isHorizontal: true,
          svgWidth: 'max-w-fix-120 max-w-fix-sm-200',
          pdClass: 'py-sm-5',
          options: [
            {
              label: translateTo('Apartment', lang),
              value: 'Apartment',
              img: svgIcons.apartment,
              color: 'blue',
            },
            {
              label: translateTo('House', lang),
              value: 'House',
              img: svgIcons.house,
              color: 'blue',
            },
            {
              label: translateTo('Building land', lang),
              value: 'Building land',
              img: svgIcons.land,
              color: 'blue',
            },
          ],
        },
      ],
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
