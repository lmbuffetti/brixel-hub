import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel/brixel-components';

export const Questions = [
  {
    titleGreen: 'Hello, let’s get started.',
    title: "What do you want to sell?",
    component: BrixelRadioButton,
    history: "propertyType",
    inputs: [{
      label: '',
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
        icon: "property-house",
        backIcon: 'red',

      }
    ],
    icons: true,
    autoSlide: true,
    successMessage: 'Ok. Got it.'
  },
  {
    title: "How many rooms?",
    component: BrixelInputStepNumber,
    history: "allRooms",
    inputs: [
      {
        label: '',
        name: 'rooms',
        validation: [Validation.required, Validation.isNumber],
        step: [0.5],
      },
    ],
    show: true,
    successMessage: 'This is a nice number.'
  },
  {
    title: {
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
        help: 'Use net living space',
        unit: 'm2'
      },
    ],
    showTop: true,
  },
  {
    title: {
      House: "When was your house built?",
      Apartment: "When was your apartment built?"
    },
    component: BrixelInputText,
    history: "constructionYear",
    inputs: [
      {
        label: '',
        name: 'constructionYear',
        type: 'number',
        validation: [Validation.required, Validation.isNumber, Validation.isYear],
      },
    ],
    show: true,
  },
  {
    title: "Where is your property located?",
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
];
