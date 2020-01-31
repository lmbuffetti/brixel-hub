import { BrixelButtonIcon, BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel/brixel-components';
import resumeApartment from '../images/BrxielComingTown/resumeApartment.svg';
import resumeHouse from '../images/BrxielComingTown/resumeHouse.svg';
import Cat from '../images/BrxielComingTown/firstAwards.svg';
import SaleProperty from '../images/BrxielComingTown/createProfile.svg';
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
import { translateTo } from '../utils/translation';

export const QuestionsList = (lang) => [
  {
    className: 'radioBtnImg',
    titleGreen: translateTo(lang, 'Hello, let\'s get started.'),
    title: translateTo(lang, "What property do you have?"),
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
        label: translateTo(lang, "Apartment"),
        value: "Apartment",
        img: apartment,
      },
      {

        label: translateTo(lang, "House"),
        value: "House",
        img: house,

      }
    ],
    successMessage: translateTo(lang, 'Ok. Got it.')
  },
  {
    title: translateTo(lang, "How many rooms?"),
    component: BrixelInputStepNumber,
    history: "allRooms",
    className: 'max-w-fix-464',
    inputs: [
      {
        classNameBox: 'max-w-fix-464',
        label: '',
        name: 'bedrooms',
        type: 'number',
        validation: [Validation.positiveNumber, Validation.required],
        step: [1],
        min: 1,
      },
    ],
    successMessage: translateTo(lang, 'This is a nice number.')
  },
  {
    title: translateTo(lang, "What is the living space?"),
    component: BrixelInputText,
    history: "livingSpace",
    inputs: [
      {
        label: '',
        name: 'livingSpace',
        type: 'number',
        validation: [Validation.isNumber, Validation.required],
        help: translateTo(lang, 'Use net living space'),
        unit: 'm2',
        classNameBox: 'bgLight100 p-1 brdRadius max-w-fix-464',
        placeholder: translateTo(lang, 'e.g. 120'),
      },
    ],
    successMessage: translateTo(lang, 'Great living space.')
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
        classNameBox: 'bgLight100 p-1 brdRadius max-w-fix-464',
        placeholder: translateTo(lang, 'e.g. 1990'),
        validation: [Validation.isYear, Validation.required],
      },
    ],
    successMessage: translateTo(lang, 'A good year for real estate.')
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
    successMessage: translateTo(lang, 'That is an interesting location.')
  },
  {
    title: translateTo(lang, "Great.<br />Your property was created."),
    history: "resume",
    cardType: 'Resume',
    imgApartment: resumeApartment,
    imgHouse: resumeHouse,
  },
  {
    title: translateTo(lang, "And the first award goes to… You!"),
    subtitle: translateTo(lang, "You earned the <span class=txtGreen400>\"Homebase\"</span> Award and +50 Brixels."),
    history: "rewardsStep",
    cardType: 'RewardsStep',
    img: Cat,
  },
  {
    title: translateTo(lang, "Every home needs an owner."),
    history: "lastStep",
    cardType: 'LastStep',
    img: SaleProperty,
  },
  {
    signupTitle: translateTo(lang, "Create your profile to save your progress."),
    loginTitle: translateTo(lang, "Login to your profile to save your progress."),
    history: "createProfile",
    cardType: 'createProfile',
  },
];
