import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel/brixel-components';
import ResumeCard from '../images/BrxielComingTown/PlaceholderProperty.jpg';
import Cat from '../images/BrxielComingTown/cat.png';
import SaleProperty from '../images/BrxielComingTown/SaleProperty.png';


export const Questions = [
  {
    titleGreen: 'Hello, let’s get started.',
    title: "What do you want to sell?",
    component: BrixelRadioButton,
    history: "propertyType",
    icons: true,
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
    successMessage: 'Ok. Got it.'
  },
  {
    title: "How many rooms?",
    component: BrixelInputStepNumber,
    history: "allRooms",
    inputs: [
      {
        label: '',
        name: 'bedrooms',
        type: 'number',
        validation: [Validation.isNumber, Validation.required],
        step: [1],
        min: 1,
      },
    ],
    successMessage: 'This is a nice number.'
  },
  {
    title: "What is the living space?",
    component: BrixelInputText,
    history: "livingSpace",
    inputs: [
      {
        label: '',
        name: 'livingSpace',
        type: 'number',
        validation: [Validation.isNumber, Validation.required],
        help: 'Use net living space',
        unit: 'm2'
      },
    ],
  },
  {
    title: "What is the construction year?",
    component: BrixelInputText,
    history: "sellingCriteria",
    inputs: [
      {
        label: '',
        name: 'constructionYear',
        type: 'number',
        validation: [Validation.isYear, Validation.required],
      },
    ],
  },
  {
    title: "Where is the location?",
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
    title: "Great.<br />Your property was created.",
    history: "resume",
    cardType: 'Resume',
    img: ResumeCard,
  },
  {
    title: "And the first award goes to… You!",
    subtitle: "You earned the <span class=txtGreen400>„Homebase“</span> Award and +50 Brixels.",
    history: "rewardsStep",
    cardType: 'RewardsStep',
    img: Cat,
  },
  {
    title: "Every home needs an owner.",
    history: "lastStep",
    cardType: 'LastStep',
    img: SaleProperty,
  },
  {
    title: "Create your profile to save your progress.",
    history: "createProfile",
    cardType: 'createProfile',
  },
];
