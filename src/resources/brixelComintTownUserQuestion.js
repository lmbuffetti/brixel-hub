import { BrixelCheckbox, BrixelRadioButton } from '@brixel/brixel-components';
import BrixelRadioEmoji from '../components/BrixelRadioEmoji';
import BrixelRadioCard from '../components/BrixelRadioCard';
import brixelComingTownLast from '../images/BrxielComingTown/LastSlideBrixelComingTown.svg';
import Martin from '../images/BrxielComingTown/Martin.png';
import { translateTo } from '../utils/translation';
import empowerSellOwn from '../images/BrxielComingTown/empowerSellOwn.svg';
import empowerBestMarketing from '../images/BrxielComingTown/empowerBestMarketing.svg';
import empowerBestPersonalSupport from '../images/BrxielComingTown/empowerBestPersonalSupport.svg';

export const maxLength = (value) => {
  const error = !value || (value.length <= 3)
    ? null
    : 'Select up 3 select';

  return error;
};

export const QuestionsList = (lang) => [
  {
    title: translateTo(lang, 'What is your situation?'),
    component: BrixelRadioButton,
    history: 'situation',
    icons: true,
    vCentered: true,
    inputs: [{
      label: '',
      labelEmail: 'What is your situation?',
      deactivable: true,
      name: 'situation',
    }],
    options: [
      {
        label: translateTo(lang, 'I want to start selling.'),
        value: 'start-selling',
      },
      {
        label: translateTo(lang, 'I am thinking about selling.'),
        value: 'thinking-selling',

      },
      {
        label: translateTo(lang, 'I am just curious.'),
        value: 'curious',

      },
    ],
    successMessage: translateTo(lang, 'Ok. Look like the time is right.'),
  },
  {
    title: translateTo(lang, 'What would help you most?'),
    component: BrixelCheckbox,
    history: 'helpYouMost',
    icons: true,
    inputs: [{
      label: translateTo(lang, 'Please choose up to 3 options.'),
      labelEmail: 'What would help you most?',
      name: 'helpYouMost',
      validation: [maxLength],
      max: 3,
    }],
    options: [
      {
        label: translateTo(lang, 'Market data'),
        value: 'market-data',
      },
      {
        label: translateTo(lang, 'A guided selling process'),
        value: 'guided-process',

      },
      {
        label: translateTo(lang, 'Templates and checklists'),
        value: 'templates',

      },
      {
        label: translateTo(lang, 'Personal support'),
        value: 'personal-support',
      },
      {
        label: translateTo(lang, 'Creating the documentation'),
        value: 'documentation',

      },
      {
        label: translateTo(lang, 'Price estimation'),
        value: 'price-estimation',

      },
    ],
    successMessage: translateTo(lang, 'Thanks. Is this your final choice?'),
  },
  {
    title: translateTo(lang, 'How important are the following criteria if you are selling?'),
    component: BrixelRadioEmoji,
    history: 'criteriaForSelling',
    inputs: [
      {
        deactivable: true,
        label: translateTo(lang, 'I want to save money.'),
        name: 'criteriaForSelling.saveMoney',
        min: 1,
      },
      {
        deactivable: true,
        label: translateTo(lang, 'I want the best presentation.'),
        name: 'criteriaForSelling.bestPresentation',
      },
      {
        deactivable: true,
        label: translateTo(lang, 'I want to minimze my efforts.'),
        name: 'criteriaForSelling.minimizeEfforts',
      },
      {
        deactivable: true,
        label: translateTo(lang, 'I want to have maximum control.'),
        name: 'criteriaForSelling.maximumControl',
      },
      {
        deactivable: true,
        label: translateTo(lang, 'I want personal support.'),
        name: 'criteriaForSelling.personalSupport',
      },
    ],
    options: [
      {
        label: 'I don\'t care',
        value: 4,
        symbol: '🙁',
      },
      {
        label: 'Why not',
        value: 3,
        symbol: '😐',
      },
      {
        label: 'Nice to have',
        value: 2,
        symbol: '🙂',
      },
      {
        label: 'Must have',
        value: 1,
        symbol: '🥳',
      },
    ],
    successMessage: translateTo(lang, 'Cheers. This helps us a lot.'),
  },

  {
    title: translateTo(lang, 'How can we empower you the best?'),
    component: BrixelRadioCard,
    history: 'empowerBest',
    inputs: [
      {
        labelEmail: translateTo(lang, 'How can we empower you the best?'),
        label: translateTo(lang, 'Please choose one option.'),
        name: 'empower',
      },
    ],
    options: [
      {
        label: translateTo(lang, 'With the right tools to sell on your own.'),
        value: 'sell-your-own',
        img: empowerSellOwn,
      },
      {
        className: 'mx-2',
        label: translateTo(lang, 'With great marketing to stick out of the crowd.'),
        value: 'marketing',
        img: empowerBestMarketing,
      },
      {
        label: translateTo(lang, 'With personal support all the way to closing of the deal.'),
        value: 'personal-support',
        img: empowerBestPersonalSupport,
      },
    ],
    successMessage: translateTo(lang, 'That is interesting.'),
  },
  {
    title: translateTo(lang, 'What would be a fair price for such a service?'),
    component: BrixelRadioButton,
    history: 'servicePrice',
    icons: true,
    inputs: [{
      label: '',
      labelEmail: translateTo(lang, 'What would be a fair price for such a service?'),
      name: 'servicePrice',
    }],
    options: [
      {
        label: translateTo(lang, 'Up to EUR 500'),
        value: '500',
      },
      {
        label: translateTo(lang, 'Up to EUR 1,000'),
        value: '1000',

      },
      {
        label: translateTo(lang, 'Up to EUR 3,000'),
        value: '3000',

      },
      {
        label: translateTo(lang, 'More than EUR 3,000'),
        value: '+3000',

      },
    ],
    successMessage: translateTo(lang, 'Fair enough.'),
  },
  {
    title: translateTo(lang, 'Hi, I am Martin<br />from Brixel.'),
    history: 'chat',
    cardType: 'chat',
    img: Martin,
    message: [
      `${translateTo(lang, 'Thank you for taking your time. It looks like Brixel is the perfect fit for you.')} 👍`,
      translateTo(lang, 'We get back to you and let you know when we start our business in your region.'),
      `${translateTo(lang, 'Feel free to contact me any time')}`,
      `💬 ${translateTo(lang, 'Whatsapp')}: <a href='https://wa.me/41799332918' target='_blank'>+41 79 933 29 18</a><br />` +
      `📞 ${translateTo(lang, 'Phone')}: <a href='tel:+41433335700' target='_blank'>+41 43 333 57 00</a><br />` +
      `✉️ ${translateTo(lang, 'E-mail')}: <a href='mailto:martin@brixel.io' target='_blank'>martin@brixel.io</a>`,
      translateTo(lang, 'All the best. Martin'),
      translateTo(lang, 'P.S. Do you want to hear a joke?'),
    ],
  },
  {
    title: translateTo(lang, 'What kind of building weighs the least?'),
    subtitle: translateTo(lang, 'A Lighthouse.'),
    img: brixelComingTownLast,
    history: 'LastStep',
    cardType: 'LastStep',
  },
];
