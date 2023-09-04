/* eslint-disable max-len */
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import TermsContidionSwitch from '../../../Pages/PackageFlow/TermsContidionSwitch';
import translateTo from '../../../utils/translation';

// QUESTION LISTS
export const QuestionsList = (lang) => {
  let question: QuestionsListType[] = [];

  question = [
    {
      title: translateTo('Accept all the terms to start marketing your property', lang),
      cardType: 'loadComponent',
      history: 'termsCondition',
      className: 'max-w-fix-768 ml-a mr-a brdRadius bgWhite brdSmall brdText50',
      footerWidth: 'max-w-fix-768',
      component: TermsContidionSwitch,
      hideContinueBtn: true,
      hideFooter: true,
    },
  ];
  question.push({
    skipResume: true,
    history: 'savingData',
    cardType: 'createProfile',
    toSave: true,
  });
  return question;
};
