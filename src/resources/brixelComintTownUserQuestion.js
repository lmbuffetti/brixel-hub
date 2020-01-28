import { BrixelCheckbox, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel/brixel-components';
import BrixelRadioEmoji from '../components/BrixelRadioEmoji';
import BrixelRadioCard from '../components/BrixelRadioCard';
import brixelComingTown from '../images/BrxielComingTown/brixelComingTown.png';
import brixelComingTownLast from '../images/BrxielComingTown/LastSlideBrixelComingTown.png';
import Martin from '../images/BrxielComingTown/Martin.png';

export const maxLength = (value) => {
  const error = value && (value.length <= 3)
    ? null
    : 'Select up 3 select';

  return error;
};

export const Questions = [
  {
    title: "Welcome to the home of your home.",
    subtitle: "You earned the <span class=txtGreen400>„Newcomer“</span> Award and +100 Brixels.",
    history: "rewardsStep",
    cardType: 'RewardsStep',
    img: brixelComingTown,
  },
  {
    title: "What is your situation?",
    component: BrixelRadioButton,
    history: "situation",
    icons: true,
    inputs: [{
      label: '',
      name: 'situation',
      validation: [Validation.required],
    }],
    options: [
      {
        label: "I want to start selling.",
        value: "start-selling",
      },
      {
        label: "I am thinking about selling.",
        value: "thinking-selling",

      },
      {
        label: "I am just curious.",
        value: "curious",

      }
    ],
    successMessage: 'Ok. Got it.'
  },
  {
    title: "What would help you most?",
    component: BrixelCheckbox,
    history: "helpYouMost",
    icons: true,
    inputs: [{
      label: 'Please choose up to 3 options.',
      name: 'helpYouMost',
      validation: [maxLength, Validation.required],
      max: 3,
    }],
    options: [
      {
        label: "Market data",
        value: "market-data",
      },
      {
        label: "A guided selling process",
        value: "guided-process",

      },
      {
        label: "Templates and checklists",
        value: "templates",

      },
      {
        label: "Personal support",
        value: "personal-support",
      },
      {
        label: "Creating the documentation",
        value: "documentation",

      },
      {
        label: "Price estimation",
        value: "price-estimation",

      }
    ],
    successMessage: 'Ok. Got it.'
  },
  {
    title: "How important are the following criteria if you are selling?",
    component: BrixelRadioEmoji,
    history: "allRooms",
    inputs: [
      {
        label: 'I want to save money.',
        name: 'criteriaForSelling.saveMoney',
        validation: [Validation.required],
        min: 1,
      },
      {
        label: 'I want the best presentation.',
        name: 'criteriaForSelling.bestPresentation',
        validation: [Validation.required],
      },
      {
        label: 'I want to minimze my efforts.',
        name: 'criteriaForSelling.minimizeEfforts',
        validation: [Validation.required],
      },
      {
        label: 'I want to have maximum control.',
        name: 'criteriaForSelling.maximumControl',
        validation: [Validation.required],
      },
      {
        label: 'I want personal support.',
        name: 'criteriaForSelling.personalSupport',
        validation: [Validation.required],
      },
    ],
    successMessage: 'This is a nice number.'
  },

  {
    title: "How can we empower you best?",
    component: BrixelRadioCard,
    history: "empowerBest",
    inputs: [
      {
        label: 'Please choose your favorite option.',
        name: 'empower',
        validation: [Validation.required],
      },
    ],
    successMessage: 'This is a nice number.'
  },
  {
    title: "What would be a fair price for such a service?",
    component: BrixelRadioButton,
    history: "servicePrice",
    icons: true,
    inputs: [{
      label: '',
      name: 'servicePrice',
      validation: [Validation.required],
    }],
    options: [
      {
        label: "Up to EUR 500",
        value: "500",
      },
      {
        label: "Up to EUR 1’000",
        value: "1000",

      },
      {
        label: "Up to EUR 3’000",
        value: "3000",

      },
      {
        label: "More than EUR 3’000",
        value: "+3000",

      }
    ],
    successMessage: 'Ok. Got it.'
  },
  {
    title: "Hi, I am Martin<br />from Brixel.",
    history: "chat",
    cardType: 'chat',
    img: Martin,
    message: [
      "Thank you for taking your time. It looks like Brixel is the perfect fit for you. 👍",
      "We get back to you and let you know when we start our business in your region.",
      "Feel free to contact me any time<br />" +
      "💬 Whatsapp: <a href='https://wa.me/41799332918' target='_blank'>+41 79 933 29 18</a><br />" +
      "📞 Phone: <a href='tel:+410433335700' target='_blank'>+41 43 333 57 00</a><br />" +
      "✉️ E-Mail: <a href='mailto:martin@brixel.io' target='_blank'>martin@brixel.io</a>",
      "All the best. Martin",
      "P.S. Do you want to hear a joke?"
    ]
  },
  {
    title: "What kind of building weighs the least?",
    subtitle: "A Lighthouse.",
    img: brixelComingTownLast,
    history: "LastStep",
    cardType: 'LastStep',
  },
];
