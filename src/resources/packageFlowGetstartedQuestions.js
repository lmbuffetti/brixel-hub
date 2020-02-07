import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel/brixel-components';
import { translateTo } from '../utils/translation';

export const maxLengthNum = (val, name) => (value) => {
  const error = !value || (value < val)
    ? null
    : `The ${name} have to be less then ${val}`;

  return error;
};

export const minLengthNum = (val, name) => (value) => {
  const error = !value || (value >= val)
    ? null
    : `The ${name} have to be more then ${val}`;

  return error;
};

const minLengthNumYear = minLengthNum(1500, 'year');
const maxLengthNumRooms = maxLengthNum(30, 'number');
const minNum999 = minLengthNum(999, 'living space');
const maxLengthNumLivSpace = maxLengthNum(9999, 'living space');
const maxLengthNumYear = maxLengthNum(2030);

export const QuestionsList = (lang) => [
  {
    title: translateTo(lang, "What property do you have?"),
    component: BrixelRadioButton,
    history: "propertyType",
    inputs: [{
      label: '',
      name: 'propertyType',
      validation: [Validation.required],
    }],
    options: [
      {
        label: translateTo(lang, "Apartment"),
        value: "Apartment",
        icon: "property-apartment"
      },
      {
        label: translateTo(lang, "House"),
        value: "House",
        icon: "property-house"
      }
    ],
    icons: true,
  },
  {
    title: "How many Rooms and Bathrooms are there in your house ?",
    component: BrixelInputStepNumber,
    history: "allRooms",
    inputs: [
      {
        classNameBox: 'max-w-fix-md-232 mb-2',
        label: translateTo(lang, 'Rooms'),
        name: 'bedrooms',
        type: 'number',
        validation: [maxLengthNumRooms, Validation.positiveNumber, Validation.required],
        step: [0.5],
      },
      {
        classNameBox: 'max-w-fix-md-232 mb-2',
        label: translateTo(lang, 'Bathrooms'),
        name: 'bathrooms',
        type: 'number',
        validation: [maxLengthNumRooms],
        step: [1],
      },
      {
        classNameBox: 'max-w-fix-md-232',
        label: translateTo(lang, 'Separate Toilets'),
        name: 'separateToilets',
        type: 'number',
        validation: [maxLengthNumRooms],
        step: [1],
      },
    ],
  },
  {
    title: translateTo(lang, "What is the living space?"),
    component: BrixelInputText,
    history: "livingSpace",
    inputs: [
      {
        className: 'max-w-fix-md-232',
        label: '',
        name: 'livingSpace',
        type: 'number',
        validation: [Validation.isNumber, maxLengthNumLivSpace, Validation.required],
        help: translateTo(lang, 'Use net living space'),
        unit: 'm2',
        classNameBox: 'bgLight100 p-1 brdRadius max-w-fix-md-288',
        placeholder: translateTo(lang, 'e.g. 120'),
      },
    ],
  },
  {
    title: translateTo(lang, "What is the construction year?"),
    component: BrixelInputText,
    history: "constructionYear",
    inputs: [
      {
        label: '',
        name: 'constructionYear',
        type: 'number',
        placeholder: translateTo(lang, 'e.g. 1990'),
        classNameBox: 'bgLight100 p-1 brdRadius max-w-fix-md-232',
        validation: [minLengthNumYear, maxLengthNumYear, Validation.required],
      },
    ],
  },
  {
    title: translateTo(lang, "What is the location?"),
    component: "Map",
    history: "locationInput",
    inputs: [
      {
        name: 'location.address',
        type: 'Map',
        validation: [Validation.required],
      },
    ],
  },
  {
    title: translateTo(lang, "We couldn't get the exact location of your property. Can you give us your Zip Code?"),
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
        label: '',
        name: 'location.zip',
        type: 'number',
        validation: [minNum999, Validation.required],
      },
    ],
  },
  {
    title: translateTo(lang,"What do you need the market check for?"),
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
        "label": translateTo(lang,"I would like to sell my property"),
        "value": "seller"
      },
      {
        "label": translateTo(lang,"Because of an inheritance or transfer within the family"),
        "value": "inheritance"
      },
      {
        "label": translateTo(lang,"I just want to know the price development of my property. I don't want to sell"),
        "value": "price-development"
      },
      {
        "label": translateTo(lang,"I would like to conclude or renew my mortgage"),
        "value": "mortgage"
      },
      {
        "label": translateTo(lang,"I would like to buy a property"),
        "value": "buyer"
      },
      {
        "label": translateTo(lang,"Just out of curiosity"),
        "value": "curiosity"
      },
      {
        "label": translateTo(lang,"Other reason"),
        "value": "other"
      }
    ],
    icons: true,
  },
  {
    title: translateTo(lang,"When do you want to sell your apartment?"),
    component: BrixelRadioButton,
    conditions: [{
      name: 'ownerType',
      value: 'seller',
    }],
    history: "apartmentSellTiming",
    inputs: [
      {
        label: '',
        name: 'apartmentSellTiming',
        validation: [Validation.required],
      },
    ],
    options: [
      {
        "label": translateTo(lang,"As soon as possible"),
        "value": "asap"
      },
      {
        "label": translateTo(lang,"In a few months"),
        "value": "few-months"
      },
      {
        "label": translateTo(lang,"I don't want to sell now"),
        "value": "no-sell"
      }
    ],
    icons: true,
  },
  {
    conditions: [{
      name: 'owner',
      value: null,
    }],
    signupTitle: translateTo(lang, "Create your profile to save your progress."),
    loginTitle: translateTo(lang, "Login to your profile to save your progress."),
    history: "createProfile",
    cardType: 'createProfile',
  },
];
