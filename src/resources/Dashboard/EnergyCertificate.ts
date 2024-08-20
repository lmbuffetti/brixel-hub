/* eslint-disable max-len */
import lazyWithRetry from '../../components/LazyWithRetry';
import ClipboardImg from '../../images/Contact/checkContact.svg';
import translateTo from '../../utils/translation';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';

const EnergyRequest = lazyWithRetry(() => import('../../Pages/Dashboard/Buyer/Energy/EnergyRequest'));

// QUESTION LISTS
export const QuestionsList = (lang) => {
  let contact: QuestionsListType[] = [];

  contact = [
    {
      cardType: 'loadComponent',
      history: 'intro',
      className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-3 p-sm-5',
      footerWidth: 'max-w-fix-600',
      component: EnergyRequest,
      hideContinueBtn: true,
    },
    // GENERAL SAVING FUNCTION FOR EVERYONE
    {
      background: '',
      hideProgress: true,
      cardType: 'card',
      title: translateTo('Thank you for your request', lang),
      img: ClipboardImg,
      imgMaxWidth: 'max-w-fix-160 w-fix-144',
      cardClass: 'max-w-fix-440 ml-a mr-a pb-5',
      subtitle: translateTo('Our team will contact you shortly to clarify any questions and to proceed with the next steps.', lang),
      history: 'success',
      vCentered: true,
      toSave: true,
    },
  ];
  return contact;
}
