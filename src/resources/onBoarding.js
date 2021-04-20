import {
  BrixelRadioButton,
  Validation,
} from '@brixel/brixel-components';
import { translateTo } from '../utils/translation';

import homesSvg from '../images/getstarted/svgs/homes.svg';
// QUESTION LISTS
export const QuestionsList = (lang) => [
  {
    titleGreen: translateTo(lang, 'Hello, let\'s get started.'),
    title: translateTo(lang, 'What can we do for you?'),
    history: '',
    vCentered: true,
    bgImg: homesSvg,
    inputs: [{
      component: BrixelRadioButton,
      className: 'radioBtnImg max-w-fix-400 m-a',
      pdClass: 'py-2 py-lg-3 px-1',
      label: '',
      name: 'userType',
      validation: [Validation.required],
      icons: true,
      options: [
        {
          label: 'I want to start selling',
          value: 'seller',
        },
        {
          label: 'I want to estimate a property',
          value: 'estimation',
        },
        {
          label: "I'm looking to buy",
          value: 'buyer',
        },
      ],
    }],
    successMessage: translateTo(lang, 'Ok. Got it.'),
  },
  {
    history: 'savingData',
    cardType: 'updateProfile',
    toSave: true,
    action: 'updateUser',
  },
];
