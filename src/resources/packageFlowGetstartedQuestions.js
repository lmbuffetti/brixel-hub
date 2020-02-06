import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel/brixel-components';
import { translateTo } from '../utils/translation';

export const maxLengthNum = (val) => (value) => {
  const error = !value || (value < val)
    ? null
    : 'Select up 3 select';

  return error;
};

export const minLengthNum = (val) => (value) => {
  const error = !value || (value >= val)
    ? null
    : 'Select up 3 select';

  return error;
};

const minLengthNumYear = minLengthNum(1500);
const maxLengthNumRooms = maxLengthNum(30);
const maxLengthNumLivSpace = maxLengthNum(9999);
const maxLengthNumYear = maxLengthNum(2030);

export const QuestionsList = (lang) => [
  {
    text: translateTo(lang,"What do you want to sell?"),
    component: BrixelRadioButton,
    history: "propertyType",
    inputs: [{
      label: 'Property type',
      name: 'propertyType',
      validation: [Validation.required],
    }],
    options: [
      {
        label: "Apartment",
        value: "Apartment",
        icon: "properties"
      },
      {
        label: "House",
        value: "House",
        icon: "property-house"
      }
    ],
    icons: true,
    autoSlide: true,
  },
  {
    text: {
      House: "How many Rooms and Bathrooms are there in your house ?",
      Apartment: "How many Rooms and Bathrooms are there in your apartment ?"
    },
    component: BrixelInputStepNumber,
    history: "allRooms",
    inputs: [
      {
        label: 'Rooms',
        name: 'rooms',
        type: 'number',
        validation: [Validation.positiveNumber, maxLengthNumRooms, Validation.required],
        step: [0.5],
      },
      {
        label: 'Bathrooms',
        name: 'bathrooms',
        type: 'number',
        validation: [Validation.positiveNumber, maxLengthNumRooms, Validation.required],
        step: [1],
      },
      {
        label: 'Separate Toilets',
        name: 'separateToilets',
        type: 'number',
        validation: [Validation.positiveNumber, maxLengthNumRooms, Validation.required],
        step: [1],
      },
    ],
    show: true,
  },
  {
    text: {
      House: "What's the living space of your house ?",
      Apartment: "What's the living space of your apartment ?"
    },
    component: BrixelInputText,
    history: "livingSpace",
    inputs: [
      {
        label: 'Insert your living space here (m2)',
        name: 'livingSpace',
        type: 'number',
        validation: [Validation.required, Validation.isNumber],
      },
    ],
    show: true,
  },
  {
    text: {
      House: "When was your house built?",
      Apartment: "When was your apartment built?"
    },
    component: BrixelInputText,
    history: "constructionYear",
    inputs: [
      {
        label: 'Insert year',
        name: 'constructionYear',
        type: 'number',
        validation: [Validation.required, Validation.isYear],
      },
    ],
    show: true,
  },
  {
    text: "Where is your property located?",
    component: "Map",
    history: "locationInput",
    inputs: [
      {
        name: 'location.address',
        type: 'Map',
        validation: [Validation.required],
      },
    ],
    show: true,
  },
  {
    text: "We couldn't get the exact location of your property. Can you give us your Zip Code?",
    component: BrixelInputText,
    conditions: [
      {
        name: 'location.zip',
        value: null,
      },
      {
        name: 'location.countryCode',
        value: "CH",
      }
    ],
    history: "zipInput",
    inputs: [
      {
        label: 'Insert your zip code',
        name: 'location.zip',
        type: 'number',
        validation: [Validation.required],
      },
    ],
    show: false,
  },
  {
    text: "What do you need the market check for?",
    component: BrixelRadioButton,
    history: "ownerType",
    inputs: [
      {
        label: '',
        name: "ownerType",
        validation: [Validation.required],
      },
    ],
    options: [
      {
        "label": "I would like to sell my property",
        "value": "seller"
      },
      {
        "label": "Because of an inheritance or transfer within the family",
        "value": "inheritance"
      },
      {
        "label": "I just want to know the price development of my property. I don't want to sell",
        "value": "price-development"
      },
      {
        "label": "I would like to conclude or renew my mortgage",
        "value": "mortgage"
      },
      {
        "label": "I would like to buy a property",
        "value": "buyer"
      },
      {
        "label": "Just out of curiosity",
        "value": "curiosity"
      },
      {
        "label": "Other reason",
        "value": "other"
      }
    ],
    show: true,
    autoSlide: true,
  },
  {
    text: "When do you want to sell your apartment?",
    component: BrixelRadioButton,
    conditions: [{
      name: 'ownerType',
      value: 'seller',
    }],
    history: "apartmentSellTiming",
    inputs: [
      {
        label: 'Insert your zip code',
        name: 'apartmentSellTiming',
        validation: [Validation.required],
      },
    ],
    options: [
      {
        "label": "As soon as possible",
        "value": "asap"
      },
      {
        "label": "In a few months",
        "value": "few-months"
      },
      {
        "label": "I don't want to sell now",
        "value": "no-sell"
      }
    ],
    show: false,
  },
  {
    signupTitle: translateTo(lang, "Create your profile to save your progress."),
    loginTitle: translateTo(lang, "Login to your profile to save your progress."),
    history: "createProfile",
    cardType: 'createProfile',
  },
];
