/* eslint-disable max-len */
import {
  BrixelRadioButton,
  BrixelInputText,
  BrixelSelect,
  Validation,
} from '@brixel/brixel-components/dist/form';
import { svgIcons } from '../Utilities/svgIcons';
import { translateTo } from '@brixel/brixel-components';

import checkSvg from '../../images/Contact/checkContact.svg';
import houseHandSvg from '../../images/Contact/houseHand.svg';
import dotsHandSvg from '../../images/Contact/dotsHand.svg';
import threeDotsHandSvg from '../../images/Contact/threeDotsHand.svg';
import puzzleHandSvg from '../../images/Contact/puzzleHand.svg';
// QUESTION LISTS
export const QuestionsList = (lang, company) => {
  if (company === 'baloise') {
    return [
      {
        title: translateTo('Plan your finances with Baloise.', lang),
        subtitle: translateTo('Your advice on the following topics:', lang),
        history: 'baloiseContact',
        vCentered: true,
        textsCard: [
          {
            title: 'Questions about your existing mortgage',
            image: checkSvg,
          },{
            title: 'Cancel or transfer your mortgage',
            image: dotsHandSvg,
          },{
            title: 'Possibilities of interim financing',
            image: puzzleHandSvg,
          },{
            title: 'Information on inheritance or estate planning',
            image: houseHandSvg,
          },{
            title: 'Investing and pension planning',
            image: threeDotsHandSvg,
          },
        ],
      },
      {
        title: translateTo('On what topics do you like to be advised?', lang),
        history: 'topicsAdvice',
        vCentered: true,
        footerWidth: 'max-w-fix-384',
        txtAfterNextButton: translateTo('By clicking the button you allow us to send the data you entered to Basler Versicherungen. You can find the data protection provisions applicable to Basler Versicherungen on the website.', lang),
        inputs: [{
          component: BrixelRadioButton,
          classNameBox: 'max-w-fix-384 w-perc-100 fieldHolder bgWhite brdRadius py-6 px-5 m-a',
          pdClass: 'py-2 py-lg-3 px-2',
          label: '',
          ReduxFieldClass: 'max-w-fix-464 m-a',
          name: 'topic',
          validation: [Validation.required],
          large: true,
          icons: true,
          options: [
            {
              label: 'Validate sale price',
              value: 'validateSalePrice'
            },
            {
              label: 'Cancel or transfer mortgage',
              value: 'mortgage'
            },
            {
              label: 'Advice for interim financing',
              value: 'interimFinancing'
            },
            {
              label: 'Tax implications, inheritance and estate',
              value: 'tax'
            },
            {
              label: 'Investment options or retirement planning',
              value: 'investments'
            }
          ],
        }],
      },
      {
        title: translateTo('What\'s the best time to reach you?', lang),
        history: 'timeToReachYou',
        vCentered: true,
        footerWidth: 'max-w-fix-384',
        className: 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5',
        inputs: [{
          component: BrixelSelect,
          pdClass: 'py-2 py-lg-3 px-2',
          label: 'Time',
          ReduxFieldClass: 'max-w-fix-464 m-a',
          name: 'timeTorReach',
          validation: [Validation.required],
          large: true,
          icons: true,
          options: [
            {
              label: 'Immediately',
              value: 'now'
            },
            {
              label: '+3 days',
              value: '3days'
            },
          ],
        },
        {
          component: BrixelInputText,
          ReduxFieldClass: 'max-w-fix-464 m-a',
          name: 'phone',
          label: 'Phone number',
          formatType: 'tel',
          pdClass: 'py-3 py-md-5',
        }],
        
      },
      {
        history: 'savingData',
        cardType: 'updateProfile',
        toSave: true,
        action: 'updateUser',
      },
    ];
  }
  if (company === 'ubs_key4') {
    return [
      {
        title: translateTo('Hello, what can we do for you?', lang),
        history: '',
        vCentered: true,
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
          svgWidth: 'max-w-fix-64 max-w-fix-md-168',
          svgSupport: true,
          pdClass: 'py-1 pb-sm-5 pt-sm-4',
          isHorizontal: true,
          options: [
            {
              label: translateTo('I want to start <b style="vertical-align:revert">selling</b>', lang),
              value: 'seller',
              img: svgIcons.selling,
              color: 'blue',
            },
            {
              label: translateTo('I want to <b style="vertical-align:revert">estimate</b> a property', lang),
              value: 'estimation',
              img: svgIcons.estimate,
              color: 'green',
            },
            {
              label: translateTo('I want to <b style="vertical-align:revert">buy</b> a property', lang),
              value: 'buyer',
              img: svgIcons.buy,
              color: 'red',
            },
          ],
        }],
        successMessage: translateTo('Ok. Got it.', lang),
      },
      {
        history: 'savingData',
        cardType: 'updateProfile',
        toSave: true,
        action: 'updateUser',
      },
    ];
  }
}
