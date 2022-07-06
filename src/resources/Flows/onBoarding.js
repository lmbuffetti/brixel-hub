/* eslint-disable max-len */
import {
  BrixelRadioButton,
  Validation,
} from '@brixel/brixel-components/dist/form';
import { svgIcons } from '../Utilities/svgIcons';
import { translateTo } from '../../utils/translation';

import homesSvg from '../../images/getstarted/svgs/homes.svg';
// QUESTION LISTS
export const QuestionsList = () => [
  {
    title: translateTo('Hello, what can we do for you?'),
    history: '',
    vCentered: true,
    bgImg: homesSvg,
    inputs: [{
      component: BrixelRadioButton,
      className: 'radioBtnImg',
      classNameBox: 'max-w-fix-912 ml-a mr-a px-2 px-sm-0',
      ReduxFieldClass: '',
      label: '',
      name: 'userType',
      validation: [Validation.required],
      icons: true,
      cardLayout: true,
      svgWidth: 'max-w-fix-96 max-w-fix-md-168',
      svgSupport: true,
      pdClass: 'py-1 pb-sm-5 pt-sm-4',
      isHorizontal: true,
      options: [
        {
          label: translateTo('I want to start <b style="vertical-align:revert">selling</b>'),
          value: 'seller',
          img: svgIcons.selling,
          color: 'blue',
        },
        {
          label: translateTo('I want to <b style="vertical-align:revert">estimate</b> a property'),
          value: 'estimation',
          img: svgIcons.estimate,
          color: 'green',
        },
        {
          label: translateTo('I want to <b style="vertical-align:revert">buy</b> a property'),
          value: 'buyer',
          img: svgIcons.buy,
          color: 'red',
        },
      ],
    }],
    successMessage: translateTo('Ok. Got it.'),
  },
  {
    history: 'savingData',
    cardType: 'updateProfile',
    toSave: true,
    action: 'updateUser',
  },
];
