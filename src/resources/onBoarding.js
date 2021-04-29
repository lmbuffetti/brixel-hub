import {
  BrixelRadioButton,
  Validation,
} from '@brixel/brixel-components';
import { thresholdSturges } from 'd3-array';
import { translateTo } from '../utils/translation';

import homesSvg from '../images/getstarted/svgs/homes.svg';
import selIcon from '../images/getstarted/sellIcon.svg';
import estIcon from '../images/getstarted/estIcon.svg';
import buyIcon from '../images/getstarted/buyIcon.svg';
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
      className: 'radioBtnImg',
      ReduxFieldClass: '',
      label: '',
      name: 'userType',
      validation: [Validation.required],
      icons: true,
      cardLayout: true,
      pdClass: '',
      isHorizontal: true,
      options: [
        {
          label: 'I want to start <b>selling</b>',
          value: 'seller',
          img: selIcon,
          color: 'blue',
        },
        {
          label: 'I want to <b>estimate</b> a property',
          value: 'estimation',
          img: estIcon,
          color: 'green',
        },
        {
          label: 'I want to <b>buy</b> a property',
          value: 'buyer',
          img: buyIcon,
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
