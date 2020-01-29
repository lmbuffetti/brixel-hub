import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel/brixel-components';
import ResumeCard from '../images/BrxielComingTown/PlaceholderProperty.jpg';
import Cat from '../images/BrxielComingTown/cat.png';
import SaleProperty from '../images/BrxielComingTown/SaleProperty.png';
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';

export const Questions = [
  {
    className: 'radioBtnImg',
    titleGreen: 'Hello, let’s get started.',
    title: "What do you want to sell?",
    component: BrixelRadioButton,
    history: "propertyType",
    icons: true,
    inputs: [{
      className: 'radioBtnImg max-w-fix-464',
      label: '',
      name: 'propertyType',
      validation: [Validation.required],
    }],
    options: [
      {
        label: "Apartment",
        value: "Apartment",
        img: apartment,
      },
      {

        label: "House",
        value: "House",
        img: house,

      }
    ],
    successMessage: 'Ok. Got it.'
  },
  {
    title: "How many rooms?",
    component: BrixelInputStepNumber,
    history: "allRooms",
    className: 'max-w-fix-464',
    inputs: [
      {
        classNameBox: 'max-w-fix-464',
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
        unit: 'm2',
        classNameBox: 'bgLight100 p-1 brdRadius max-w-fix-464',
        placeholder: 'e.g. 120',
      },
    ],
    successMessage: 'Ok for living space.'
  },
  {
    title: "What is the construction year?",
    component: BrixelInputText,
    history: "constructionYear",
    inputs: [
      {
        label: '',
        name: 'constructionYear',
        type: 'number',
        classNameBox: 'bgLight100 p-1 brdRadius max-w-fix-464',
        placeholder: 'e.g. 1990',
        validation: [Validation.isYear, Validation.required],
      },
    ],
    successMessage: 'Roger that.'
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
    successMessage: 'Nice coordinates.'
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
  {
    signupTitle: "Create your profile to save your progress.",
    loginTitle: "Login to your profile to save your progress.",
    history: "createProfile",
    cardType: 'createProfile',
  },
];
