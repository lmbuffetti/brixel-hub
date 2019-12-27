import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel/brixel-components';

export const Questions = [
  {
    text: "What do you want to sell?",
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
        icon: "apartment"
      },
      {
        label: "House",
        value: "House",
        icon: "house"
      }
    ]
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
        validation: [Validation.required],
        step: [0.5],
      },
      {
        label: 'Bathrooms',
        name: 'bathrooms',
        validation: [Validation.required],
      },
      {
        label: 'Separate Toilets',
        name: 'separateToilets',
        validation: [Validation.required],
      },
    ],
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
        validation: [Validation.required],
      },
    ],
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
  },
  {
    text: "Where is your property located?",
    component: "Map",
    history: "locationInput",
    inputs: [
      {
        name: 'location.zip',
        type: 'Map',
        validation: [Validation.required],
      },
    ],

  },
  /* {
    "text": "What do you need the market check for?",
    "component": "BrixelInputStepNumber",
    "history": "propertyType",
    "options": [
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
    "trigger": [
      {
        "name": "apartmentSellTiming",
        "value": "seller"
      },
      {
        "name": "typeOfBuyer",
        "value": "buyer"
      }
    ]
  },
  {
    "text": {
      "House": "When do you want to sell your house ?",
      "Apartment": "When do you want to sell your apartment ?"
    },
    "component": "BrixelInputStepNumber",
    "history": "propertyType",
    "options": [
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
    ]
  },
  {
   "text": {
      "House": "How experienced are you in buying real estate?",
      "Apartment": "How experienced are you in buying real estate?"
    },
    "component": "BrixelInputStepNumber",
    "history": "propertyType",
    "options": [
      {
        "label": "I am a first time buyer",
        "value": "first-time-buyer"
      },
      {
        "label": "I already own a property",
        "value": "owned-property"
      }
    ]
  },
  {
    "text": "Sign up to unlock your report.",
    "component": "BrixelInputStepNumber",
    "history": "propertyType",
  },
  {
    "text": "Welcome back, insert your password to login to your account.",
    "component": "BrixelInputStepNumber",
    "history": "propertyType",
  } */
];
