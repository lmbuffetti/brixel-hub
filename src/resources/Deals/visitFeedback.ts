/* eslint-disable max-len */
import {BrixelCheckbox, BrixelRadioButton, BrixelTextArea, Validation} from '@brixel-io/brixel-components/dist/form';

import translateTo from '../../utils/translation';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import type {FormValueType} from '../../@types/Pages/Deals/VisitFeedback';
import successCheckImg from '../../images/Marketing/successCheck.svg';
import LoginSignup from '../../components/LoginSignup';
import {feedbackReason, feedbackInvoled} from '@brixel-io/brixel-components/dist/constants/FeedbackEmail';
// QUESTION LISTS


export const QuestionsList: (lang: string, formValue: FormValueType) => QuestionsListType[] = (lang, formValue) => {
  const feedbackReasonOptions = feedbackReason.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));

  const feedbackInvoledOptions = feedbackInvoled.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));
  const questions: QuestionsListType[] = [
    {
      title: translateTo('Tell us more!', lang),
      subtitle: translateTo('By sharing your feedback, you help bringing more transparency to the real estate business.', lang),
      history: 'feedback',
      footerWidth: 'max-w-fix-640',
      className: 'max-w-fix-640 bgWhite p-2 p-sm-4 brdRadius m-a',
      inputs: [
        {
          component: BrixelCheckbox,
          className: 'radioBtnImg',
          icons: true,
          label: formValue.status ? translateTo('What did you like most about the property?', lang) : translateTo('What did you not like about the property?', lang),
          name: 'reasons',
          options: feedbackReasonOptions,
          placeholderOther: translateTo('Write your answer here', lang),
        },
      ],
      successMessage: translateTo('Ok. Got it.', lang),
    },
  ]
  if (questions[0].inputs) {
    if (formValue.status === false) {
      questions[0].inputs.push({
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        label: translateTo('Are you still looking to buy?', lang),
        name: 'involvedPurchaseProperty',
        options: feedbackInvoledOptions,
        placeholderOther: translateTo('Write your answer here', lang),
      })
    }
    questions[0].inputs.push(  {
      component: BrixelTextArea,
      className: 'radioBtnImg ml-0 proof',
      label: translateTo('Anything you would like to add?', lang),
      placeholder: translateTo('Write your answer here.', lang),
      name: 'note',
      cardLayout: true,
      isHorizontal: true,
      svgSupport: true,
      icons: true,
    })
  }
  questions.push({
    background: 'bgCardGreen',
    hideProgress: true,
    cardType: 'card',
    title: translateTo('Thank you for your feedback!', lang),
    img: successCheckImg,
    imgMaxWidth: 'max-w-fix-104 max-w-fix-sm-144 w-perc-100 mb-sm-6',
    cardClass: 'max-w-fix-600 ml-a mr-a pm-0 pb-sm-2',
    subtitleTooltip: formValue.status ? translateTo('A proof of financing (also called financing certificate) is a non-binding assessment of your financial situation. You can use it to prove to us that you can afford the house or apartment.', lang) : undefined,
    subtitle: formValue.status ?
      `<span class="dis-b">${translateTo('Are you ready for the next step?', lang)}</span><span>${translateTo('You can be closer to buy your dream house by making an offer now. Make sure you have a proof of financing ready.', lang)}</span>` :
      translateTo('Create a search profile to find properties for sale and on our Pre-Market that best match your criteria.', lang),
    subtitleClass: 'fweight-400 txtText800 max-w-fix-440 ml-a mr-a',
    history: 'success',
    vCentered: true,
    toSave: true,
  },
  {
    background: 'bgCardGreen',
    history: 'createProfile',
    component: LoginSignup,
    signupTitle: translateTo('Create your profile to save your progress.', lang),
    loginTitle: translateTo('Login to your profile to save your progress.', lang),
    cardType: 'createProfile',
    inputs: [{
      skipPhone: true,
      component: LoginSignup,
      name: 'register.name',
      validation: [Validation.required],
    }],
  },
  {
    history: 'savingData',
    cardType: 'createProfile',
    toSave: true,
  })

  return questions;
}
