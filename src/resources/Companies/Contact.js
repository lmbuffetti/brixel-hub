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
import taxInfo from '../../images/Contact/taxInfo.svg';
import threeDotsHandSvg from '../../images/Contact/threeDotsHand.svg';
import puzzleHandSvg from '../../images/Contact/puzzleHand.svg';
import inheritanceContactSvg from '../../images/Contact/inheritanceContact.svg';
import ClipboardImg from '../../images/scanTrial/clipboard.png';

// QUESTION LISTS
export const QuestionsList = (lang, company, isBuyer) => {
  let contact = [];
  let selectHours = []
  for (let i=8; i<=18; i++) {
    selectHours.push({
      label: `${i < 10 ? `0${i}` : i}:00 - ${i + 1 < 10 ? `0${i + 1}` : i + 1}:00`,
      value: `${i < 10 ? `0${i}` : i}:00 - ${i + 1 < 10 ? `0${i + 1}` : i + 1}:00`,
    })
  }
  let selectDays = [];
  for (let i=0; i<=6; i++) {
    let nextDay = DateTime.now().plus({ days: i }).weekday;
    let newDay = {
      label: DateTime.now().plus({ days: i }).toFormat('dd LLL yyyy', { locale: lang}),
      value: DateTime.now().plus({ days: i }).toFormat('dd-MM-yyyy', { locale: 'en'}),
    };
    if (nextDay === 6) {
      newDay = {
        label: DateTime.now().plus({ days: i + 2 }).toFormat('dd LLL yyyy', { locale: lang}),
        value: DateTime.now().plus({ days: i + 2 }).toFormat('dd-MM-yyyy', { locale: 'en'}),
      };
      i += 2;
    }
    if (nextDay === 7) {
      newDay = {
        label: DateTime.now().plus({ days: i + 1 }).toFormat('dd LLL yyyy', { locale: lang}),
        value: DateTime.now().plus({ days: i + 1 }).toFormat('dd-MM-yyyy', { locale: 'en'}),
      };
      i += 1;
    }
    const isToday = DateTime.now().plus({ days: i }).hasSame(DateTime.local(), "day");
    if (isToday && company.stub === 'baloise') {
      newDay.label = 'Immediately';
    }
    selectDays.push(newDay);
  }
  contact = [
    {
      title: `<span>${translateTo('Plan your finances with', lang)}</span><span class="ml-1">${company.name}.</span>`,
      subtitle: translateTo('Your advice on the following topics:', lang),
      history: 'intro',
      vCentered: true,
      textsCard: [
        {
          title: translateTo('Questions about your existing mortgages', lang),
          image: checkSvg,
        }, {
          title: translateTo('Cancel or transfer your mortgage', lang),
          image: dotsHandSvg,
        }, {
          title: translateTo('Possibilities of interim financing', lang),
          image: puzzleHandSvg,
        }, {
          title: translateTo('Information on inheritance or estate planning', lang),
          image: houseHandSvg,
        }, {
          title: translateTo('Investing and pension planning', lang),
          image: threeDotsHandSvg,
        },
      ],
    },
  ];
  let privacy;

  if (isBuyer) {
    contact[0].textsCard = [
      {
        title: translateTo('Individual offer for your financing', lang),
        image: checkSvg,
      }, {
        title: translateTo('Personal consultation by phone or on site', lang),
        image: dotsHandSvg,
      }, {
        title: translateTo('Application for a financing certificate', lang),
        image: puzzleHandSvg,
      }
    ];
  }

  if (company.stub === 'baloise') {
    privacy = translateTo('I agree that my data (surname, first name, address, telephone number, e-mail) may be transmitted to Basler Versicherung AG for the purpose of providing the consulting service.', lang);
    if (!isBuyer) {
      contact[0].textsCard = [
        {
          title: translateTo('Questions about your existing mortgage', lang),
          image: checkSvg,
        }, {
          title: translateTo('Cancel or transfer your mortgage', lang),
          image: dotsHandSvg,
        }, {
          title: translateTo('Possibilities of interim financing', lang),
          image: puzzleHandSvg,
        }, {
          title: translateTo('Information on inheritance or estate planning', lang),
          image: houseHandSvg,
        }, {
          title: translateTo('Investing and pension planning', lang),
          image: threeDotsHandSvg,
        },
      ];
    }
  }
  if (company.stub === 'ubs') {
    privacy = translateTo('I agree that my data (surname, first name, address, telephone number, e-mail) will be transmitted to UBS AG for the purpose of providing the consulting service.', lang);
    if (!isBuyer) {
      contact[0].textsCard = [
        {
          title: translateTo('Validate sale price', lang),
          image: checkSvg,
        }, {
          title: translateTo('Cancel or transfer your existing mortgage', lang),
          image: dotsHandSvg,
        }, {
          title: translateTo('Advice for interim financing', lang),
          image: puzzleHandSvg,
        }, {
          title: translateTo('Information on tax implications of the sale', lang),
          image: taxInfo,
        },
        {
          title: translateTo('Inheritance and estate planning', lang),
          image: inheritanceContactSvg,
        }, {
          title: translateTo('Investing and pension planning', lang),
          image: threeDotsHandSvg,
        },
      ];
    }
  }
  contact.push(
    {
      title: translateTo('On what topics do you like to be advised?', lang),
      history: 'topicsAdvice',
      vCentered: true,
      footerWidth: 'max-w-fix-544',
      className: 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5',
      inputs: [{
        component: BrixelCheckbox,
        //classNameBox: 'max-w-fix-384 w-perc-100 fieldHolder bgWhite brdRadius py-6 px-5 m-a',
        pdClass: 'py-2 py-lg-3 px-2',
        label: '',
        //ReduxFieldClass: 'max-w-fix-464 m-a',
        name: 'topics',
        validation: [Validation.required],
        large: true,
        icons: true,
        options: isBuyer ? [
          {
            label: translateTo('Individual offer for your financing', lang),
            value: 'Individual offer for your financing'
          },
          {
            label: translateTo('Personal consultation', lang),
            value: 'Personal consultation'
          },
          {
            label: translateTo('Application for a financing certificate', lang),
            value: 'Application for a financing certificate'
          },
        ] : [
          {
            label: translateTo('Validate sale price', lang),
            value: 'Validate sale price'
          },
          {
            label: translateTo('Cancel or transfer your existing mortgage', lang),
            value: 'Cancel or transfer your existing mortgage'
          },
          {
            label: translateTo('Advice for interim financing', lang),
            value: 'Advice for interim financing'
          },
          {
            label: translateTo('Tax implications, inheritance, and estate planning', lang),
            value: 'Tax implications, inheritance, and estate planning'
          },
          {
            label: translateTo('Investment options or retirement planning', lang),
            value: 'Investment options or retirement planning'
          }
        ],
      }],
    },
    {
      title: translateTo('What\'s the best time to reach you?', lang),
      history: 'timeToReachYou',
      vCentered: true,
      footerWidth: 'max-w-fix-544',
      className: 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5',
      txtAfterNextButton: privacy,
      inputs: [
        {
          component: BrixelSelect,
          pdClass: 'py-2 py-lg-3 px-2',
          label: 'Date',
          ReduxFieldClass: 'max-w-fix-464 m-a',
          name: 'time.date',
          validation: [Validation.required],
          large: true,
          icons: true,
          options: company.stub === 'ubs' ? [
            selectDays[1],
            selectDays[2],
          ] : [
            {
              label: 'Immediately',
              value: selectDays[0].value,
            },
            selectDays[1],
            selectDays[2],
            selectDays[3],
          ],
        },
        {
          conditionsOr: [
            {
              name: 'time.date',
              value: selectDays[1].value,
            },
            {
              name: 'time.date',
              value: selectDays[2].value,
            },
            {
              name: 'time.date',
              value: selectDays[3].value,
            }
          ],
          component: BrixelSelect,
          pdClass: 'py-2 py-lg-3 px-2',
          label: 'Time',
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
          large: true,
          pdClass: 'py-3 py-md-5',
          validation: [Validation.required],
        }
      ],
    },
    // GENERAL SAVING FUNCTION FOR EVERYONE
    {
      background: 'bgCardGreen',
      hideProgress: true,
      cardType: 'card',
      title: translateTo('Thank you', lang),
      img: ClipboardImg,
      imgMaxWidth: 'max-w-fix-160',
      cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
      subtitle: `<span>${translateTo('We have forwarded your request. Our partner', lang)}</span><span class="mx-1">${company.name}</span><span>${translateTo('will contact you as soon as possible.', lang)}</span>`,
      history: 'success',
      vCentered: true,
      toSave: true,
    },

  )
  return contact;
}
