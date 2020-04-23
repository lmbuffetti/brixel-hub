import { BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel/brixel-components';
import resumeApartment from '../images/BrxielComingTown/resumeApartement.svg';
import resumeHouse from '../images/BrxielComingTown/resumeHouse.svg';
import Cat from '../images/BrxielComingTown/firstAwards.svg';
import SaleProperty from '../images/BrxielComingTown/createProfile.svg';
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
import { translateTo } from '../utils/translation';

export const maxLengthNum = (val, name) => (value) => {

  const error = !value || (value < val)
    ? null
    : name === 'year' ?
      `Year can't be after ${val}` : `The ${name} have to be less then ${val}`;

  return error;
};

export const minLengthNum = (val, name) => (value) => {
  const error = !value || (value >= val)
    ? null
    : name === 'year' ?
      `Too old! year can't be before ${val}` : `The ${name} have to be more then ${val}`;

  return error;
};

const minLengthNumYear = minLengthNum(1500, 'year');
const maxLengthNumRooms = maxLengthNum(30, 'rooms');
const maxLengthNumLivSpace = maxLengthNum(9999, 'living space');
const maxLengthNumYear = maxLengthNum(2031, 'year');


export const QuestionsList = (lang, gameGroup) => {
  let getHomeBase = {name: 'Homebase', points: 100};
  if (gameGroup) {
    const getSellerLv1 = gameGroup.find(item => item.stub === 'seller-lvl1');
    if (getSellerLv1 && getSellerLv1.achievements) getHomeBase = getSellerLv1.achievements.find(item => item.stub === 'homebase');
  }
  return [
    {
      className: 'radioBtnImg',
      titleGreen: translateTo(lang, 'Hello, let\'s get started.'),
      title: translateTo(lang, "What type of property do you have?"),
      component: BrixelRadioButton,
      history: "propertyType",
      cardType: "propertyType",
      icons: true,
      vCentered: true,
      inputs: [{
        className: 'radioBtnImg max-w-fix-md-464',
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
      cardType: "allRooms",
      className: '',
      inputs: [
        {
          classNameBox: 'max-w-fix-md-232',
          label: '',
          name: 'bedrooms',
          validation: [maxLengthNumRooms, Validation.positiveNumber, Validation.required],
          step: 0.5,
          min: 1,
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.')
    },
    {
      title: translateTo(lang, "What is the living space size?"),
      component: BrixelInputText,
      history: "livingSpace",
      cardType: "livingSpace",
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
      successMessage: translateTo(lang, 'Great living space.')
    },
    {
      title: translateTo(lang, "What is the construction year?"),
      component: BrixelInputText,
      history: "constructionYear",
      cardType: "constructionYear",
      inputs: [
        {
          label: '',
          name: 'constructionYear',
          type: 'number',
          classNameBox: 'bgLight100 p-1 brdRadius max-w-fix-md-232',
          placeholder: translateTo(lang, 'e.g. 1990'),
          validation: [minLengthNumYear, maxLengthNumYear, Validation.required],
          minLenghtNum: 999,
          maxLenghtNum: 9999,
        },
      ],
      successMessage: translateTo(lang, 'A good year for real estate.')
    },
    {
      title: translateTo(lang, "What is the location?"),
      component: "Map",
      history: "locationInput",
      cardType: "locationInput",
      inputs: [
        {
          name: 'location.address',
          type: 'Map',
          validation: [Validation.required],
        },
      ],
      successMessage: translateTo(lang, "That is an interesting location.")
    },
    {
      title: translateTo(lang, "Great, Your property was created!") + " 🎉",
      history: "resume",
      cardType: 'Resume',
      imgApartment: resumeApartment,
      background: 'bgRed100',
      imgHouse: resumeHouse,
    },
    {
      conditions: [{
        name: 'owner',
        value: null,
      }],
      title: translateTo(lang, "And the first award goes to…You!"),
      subtitle: translateTo(lang, `You earned the <span class="txtGreen400">"${getHomeBase.name}"</span> Award and +${getHomeBase.points} Brixels.`),
      history: "rewardsStep",
      cardType: 'RewardsStep',
      background: 'bgPrimary100',
      img: Cat,
    },
    {
      conditions: [{
        name: 'owner',
        value: null,
      }],
      title: translateTo(lang, "Every home needs an owner."),
      history: "lastStep",
      cardType: 'LastStep',
      background: 'bgGreen100',
      img: SaleProperty,
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
}
