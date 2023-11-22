/* eslint-disable max-len */
import {BrixelCheckbox, BrixelRadioButton, BrixelTextArea, Validation} from '@brixel-io/brixel-components/dist/form';

import translateTo from '../../utils/translation';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import type {FormValueType} from '../../@types/Pages/Deals/VisitFeedback';
import successCheckImg from '../../images/Marketing/successCheck.svg';
import LoginSignup from '../../components/LoginSignup';
// QUESTION LISTS

export const feedbackReason = (lang) => ([
  {label: translateTo('The price', lang), value: 'price', icon: 'money', backIcon: 'transparent'},
  {
    label: translateTo('The amenities like garage, balcony, etc', lang),
    value: 'amenities',
    icon: 'balcony',
    backIcon: 'transparent',
  },
  {label: translateTo('The floor plan', lang), value: 'floorPlan', icon: 'plans', backIcon: 'transparent'},
  {
    label: translateTo('The location', lang),
    value: 'location',
    icon: 'location-pin-simple',
    backIcon: 'transparent',
  },
  {label: translateTo('Other', lang), value: 'other', icon: 'property-new', backIcon: 'transparent'},
]);

export const feedbackInvoled = (lang) => ([
  {label: translateTo('Yes, I’m still looking', lang), value: 'yes'},
  {label: translateTo('I’ve found a property already', lang), value: 'found'},
  {label: translateTo('No, I’ve stopped looking', lang), value: 'no'},
]);

export const QuestionsList: (lang: string, formValue: FormValueType) => QuestionsListType[] = (lang, formValue) => {

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
          label: translateTo('What did you like most about the property?', lang),
          name: 'reasons',
          options: feedbackReason(lang),
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
        options: feedbackInvoled(lang),
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
    imgMaxWidth: 'max-w-fix-104 max-w-fix-sm-160 w-perc-100',
    cardClass: 'max-w-fix-360 ml-a mr-a pm-0 pb-sm-5',
    subtitleTooltip: translateTo('A proof of financing (also called financing certificate) is a non-binding assessment of your financial situation. You can use it to prove to us that you can afford the house or apartment.', lang),
    subtitle: formValue.status ?
      `<span> ${translateTo('Are you ready for the next step?\n <br/>' +
      'You can be closer to buy your dream house by making an offer now. Make sure you have a proof of financing ready.', lang)}</span>` :
      translateTo('Create a search profile to find properties for sale and on our Pre-Market that best match your criteria.', lang),
    subtitleClass: 'fweight-400 txtText800',

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
