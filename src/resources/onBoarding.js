/* eslint-disable max-len */
import {
  BrixelRadioButton,
  Validation,
} from '@brixel/brixel-components';
import { svgIcons } from './svgIcons';
import { translateTo } from '../utils/translation';

import homesSvg from '../images/getstarted/svgs/homes.svg';
// QUESTION LISTS
export const QuestionsList = (lang) => [
  {
    title: translateTo(lang, 'Hello, what can we do for you?'),
    history: '',
    vCentered: true,
    bgImg: homesSvg,
    inputs: [{
      component: BrixelRadioButton,
      className: 'radioBtnImg',
      ReduxFieldClass: '',
      label: '',
      name: 'userType',
      validation: [Validation.required],
      icons: true,
      cardLayout: true,
      svgSupport: true,
      pdClass: '',
      isHorizontal: true,
      options: [
        {
          label: 'I want to start <b>selling</b>',
          value: 'seller',
          img: svgIcons.selling,
          color: 'blue',
        },
        {
          label: 'I want to <b>estimate</b> a property',
          value: 'estimation',
          img: svgIcons.estimate,
          color: 'green',
        },
        {
          label: 'I want to <b>buy</b> a property',
          value: 'buyer',
          img: svgIcons.buy,
          color: 'red',
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
