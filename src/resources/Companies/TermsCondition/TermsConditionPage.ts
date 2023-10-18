/* eslint-disable max-len */
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import TermsConditionSwitch from '../../../Pages/PackageFlow/TermsConditionSwitch';
import translateTo from '../../../utils/translation';
import successCheckImg from '../../../images/Marketing/successCheck.svg';

// QUESTION LISTS
export const QuestionsList = (lang, acceptedTerms) => {
  let question: QuestionsListType[] = [];

  question = [{
    title: acceptedTerms? translateTo('Your accepted terms', lang) : translateTo('Accept all the terms to start marketing your property', lang),
    cardType: 'loadComponent',
    history: 'termsCondition',
    className: 'max-w-fix-632 ml-a mr-a brdRadius bgWhite brdSmall brdText100',
    footerWidth: 'max-w-fix-632',
    component: TermsConditionSwitch,
    hideContinueBtn: true,
    hideFooter: true,
  }];
  if (!acceptedTerms) {
    question.push({
      background: 'bgCardGreen',
      hideProgress: true,
      cardType: 'card',
      title: translateTo('Thank you', lang),
      img: successCheckImg,
      imgMaxWidth: 'max-w-fix-160 w-perc-100',
      cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
      subtitle: translateTo('We are ready to promote your property. Once it is up and running, we will notify you. It should be live within one business day.', lang),
      subtitleClass: 'fweight-400 txtText800',
      history: 'success',
      vCentered: true,
      toSave: true,
    });
  }
  return question;
};
