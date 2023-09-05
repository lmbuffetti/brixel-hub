/* eslint-disable max-len */
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import TermsContidionSwitch from '../../../Pages/PackageFlow/TermsContidionSwitch';
import translateTo from '../../../utils/translation';
import ClipboardImg from '../../../images/scanTrial/clipboard.png';

// QUESTION LISTS
export const QuestionsList = (lang) => {
  let question: QuestionsListType[] = [];

  question = [{
    title: translateTo('Accept all the terms to start marketing your property', lang),
    cardType: 'loadComponent',
    history: 'termsCondition',
    className: 'max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdText50',
    footerWidth: 'max-w-fix-768',
    component: TermsContidionSwitch,
    hideContinueBtn: true,
    hideFooter: true,
  }];
  question.push({
    background: 'bgCardGreen',
    hideProgress: true,
    cardType: 'card',
    title: translateTo('Thank you', lang),
    img: ClipboardImg,
    imgMaxWidth: 'max-w-fix-160',
    cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
    subtitle: 'We are ready to promote your property. Once it is up and running, we will notify you. It should be live within one business day.',
    history: 'success',
    vCentered: true,
    toSave: true,
  });
  return question;
};
