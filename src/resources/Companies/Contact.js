/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelInputText,
  BrixelSelect,
  Validation,
} from '@brixel/brixel-components/dist/form';
import { translateTo } from '@brixel/brixel-components';
import { DateTime } from 'luxon';

import checkSvg from '../../images/Contact/checkContact.svg';
import houseHandSvg from '../../images/Contact/houseHand.svg';
import dotsHandSvg from '../../images/Contact/dotsHand.svg';
import threeDotsHandSvg from '../../images/Contact/threeDotsHand.svg';
import puzzleHandSvg from '../../images/Contact/puzzleHand.svg';
import inheritanceContactSvg from '../../images/Contact/inheritanceContact.svg';
// QUESTION LISTS
export const QuestionsList = (lang, company) => {
  let contact = [];
  let selectHours = []
  for (let i=8; i<=18; i++) {
    selectHours.push({
      label: `${i < 10 ? `0${i}` : i}:00 - ${i + 1 < 10 ? `0${i + 1}` : i + 1}:00`,
      value: `${i < 10 ? `0${i}` : i}:00 - ${i + 1 < 10 ? `0${i + 1}` : i + 1}:00`,
    })
  }
  let selectDays = [];
  for (let i=1; i<=6; i++) {
    let nextDay = DateTime.now().plus({ days: i }).weekday;
    let newDay = {
      value: DateTime.now().plus({ days: i + 2 }).toFormat('dd LLL', { locale: 'en'}),
      label: DateTime.now().plus({ days: i + 2 }).toFormat('dd LLL', { locale: lang}),
    };
    if (nextDay === 6) {
      newDay = {
        value: DateTime.now().plus({ days: i + 2 }).toFormat('dd LLL', { locale: 'en'}),
        label: DateTime.now().plus({ days: i + 2 }).toFormat('dd LLL', { locale: lang}),
      };
      i++;
    }
    if (nextDay === 7) {
      newDay = {
        value: DateTime.now().plus({ days: i + 2 }).toFormat('dd LLL', { locale: 'en'}),
        label: DateTime.now().plus({ days: i + 2 }).toFormat('dd LLL', { locale: lang}),
      };
      i++;
    }
    selectDays.push(newDay);
  }
  
  if (company === 'baloise') {
    contact = [
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
    ];
  }
  if (company === 'ubs_key4') {
    contact = [
      {
        title: translateTo('Plan your finacial situation with UBS.', lang),
        subtitle: translateTo('Plan your financial situation with UBS. Get your personal consultation on the following topics:', lang),
        history: 'ubsKey4Contact',
        vCentered: true,
        textsCard: [
          {
            title: 'Validate sale price',
            image: checkSvg,
          },{
            title: 'Cancel or transfer your existing mortgage',
            image: dotsHandSvg,
          },{
            title: 'Advice for interim financing',
            image: puzzleHandSvg,
          },{
            title: 'Information on tax implications of the sale',
            image: houseHandSvg,
          },
          {
            title: 'Inheritance and estate planning',
            image: inheritanceContactSvg,
          },{
            title: 'Investing and pension planning',
            image: threeDotsHandSvg,
          },
        ],
      },
    ];
  }
  contact.push(
    {
      title: translateTo('On what topics do you like to be advised?', lang),
      history: 'topicsAdvice',
      vCentered: true,
      footerWidth: 'max-w-fix-384',
      txtAfterNextButton: translateTo('By clicking the button you allow us to send the data you entered to Basler Versicherungen. You can find the data protection provisions applicable to Basler Versicherungen on the website.', lang),
      inputs: [{
        component: BrixelCheckbox,
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
            label: 'Cancel or transfer your existing mortgage',
            value: 'mortgage'
          },
          {
            label: 'Advice for interim financing',
            value: 'interimFinancing'
          },
          {
            label: 'Tax implications, inheritance, and estate planning',
            value: 'tax'
          },
          {
            label: 'Investment options or retirement planning ',
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
      inputs: [
        {
          component: BrixelSelect,
          pdClass: 'py-2 py-lg-3 px-2',
          label: 'Time',
          ReduxFieldClass: 'max-w-fix-464 m-a',
          name: 'time.date',
          validation: [Validation.required],
          large: true,
          icons: true,
          options: [
            {
              label: 'Immediately',
              value: 'now'
            },
            selectDays[0],
            selectDays[1],
            selectDays[2],
          ],
        },
        {
          conditionsOr: [
            {
              name: 'time.date',
              value: DateTime.now().plus({ days: 1 }).toFormat('dd LLL', { locale: 'en'}),
            },
            {
              name: 'time.date',
              value: DateTime.now().plus({ days: 2 }).toFormat('dd LLL', { locale: 'en'}),
            },
            {
              name: 'time.date',
              value: DateTime.now().plus({ days: 3 }).toFormat('dd LLL', { locale: 'en'}),
            }
          ],
          component: BrixelSelect,
          pdClass: 'py-2 py-lg-3 px-2',
          label: 'Hour',
          ReduxFieldClass: 'max-w-fix-464 m-a',
          name: 'time.hour',
          validation: [Validation.required],
          large: true,
          icons: true,
          options: selectHours,
        },
        {
          component: BrixelInputText,
          ReduxFieldClass: 'max-w-fix-464 m-a',
          name: 'phone',
          label: 'Phone number',
          formatType: 'tel',
          pdClass: 'py-3 py-md-5',
          validation: [Validation.required],
        }
      ],
    },
    {
      history: 'savingData',
      cardType: 'updateProfile',
      toSave: true,
      action: 'updateUser',
    },
  )
  return contact;
}
