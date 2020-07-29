import {
  BrixelRadioButton, BrixelInputStepNumber, BrixelInputText, BrixelSelect, Validation,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import Maps from '../components/Map/Maps';
import LoginSignup from '../components/LoginSignup';
import ResumeCard from '../components/ResumeCard';
import { translateTo } from '../utils/translation';
import { configureStore } from '../store';

import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';

import homesSvg from '../images/getstarted/svgs/homes.svg';
import spaceSvg from '../images/getstarted/svgs/space.svg';
import locationSvg from '../images/getstarted/svgs/location.svg';
import roomsSvg from '../images/getstarted/svgs/room.svg';
import congratsSvg from '../images/getstarted/svgs/congrats.svg';
import yearSvg from '../images/getstarted/svgs/year.svg';

// VALIDATION OF FIELDS
export const maxLengthNum = (val, name) => (value) => {
  let error = null;
  if (value && value >= val) {
    error = name === 'year' ? `Year can't be after ${val}` : `The ${name} have to be less then ${val}`;
  }
  return error;
};

export const minLengthNum = (val, name) => (value) => {
  let error = null;
  if (value && value <= val) {
    error = name === 'year' ? `Too old! year can't be before ${val}` : `The ${name} have to be more then ${val}`;
  }
  return error;
};

const minLengthNumYear = minLengthNum(1500, 'year');
const maxLengthNumRooms = maxLengthNum(31, 'rooms');
const maxLengthNumLivSpace = maxLengthNum(9999, 'living space');
const maxLengthNumYear = maxLengthNum(2031, 'year');

// QUESTION LISTS
export const QuestionsList = (lang, country = 'CH') => {
  let countryList = [];
  if (configureStore) countryList = get(configureStore.getState(), 'common.country', []);
  return [
    {
      titleGreen: translateTo(lang, 'Hello, let\'s get started.'),
      title: translateTo(lang, 'What type of property do you have?'),
      history: 'propertyType',
      vCentered: true,
      bgImg: homesSvg,
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg max-w-fix-md-464',
        pdClass: 'py-2 py-md-3 px-1',
        label: '',
        name: 'properties.propertyType',
        validation: [Validation.required],
        icons: true,
        options: [
          {
            label: translateTo(lang, 'Apartment'),
            value: 'Apartment',
            img: apartment,
          },
          {
            label: translateTo(lang, 'House'),
            value: 'House',
            img: house,

          },
        ],
      }],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: translateTo(lang, 'How many rooms?'),
      history: 'allRooms',
      cardType: 'allRooms',
      bgImg: roomsSvg,
      inputs: [
        {
          component: BrixelInputStepNumber,
          classNameBox: 'max-w-fix-md-232',
          label: '',
          name: 'properties.typology.bedrooms',
          validation: [maxLengthNumRooms, Validation.required],
          step: 0.5,
          placeholder: country === 'PT' ? 'T3' : '3',
          formatType: country === 'PT' ? 'rooms-pt' : '',
          min: 0,
          max: 30,
          fluid: true,
          startFrom: 3,
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.'),
    },
    {
      title: translateTo(lang, 'What is the living space size?'),
      history: 'livingSpace',
      cardType: 'livingSpace',
      bgImg: spaceSvg,
      inputs: [
        {
          component: BrixelInputText,
          className: 'max-w-fix-md-232',
          label: 'Net living space',
          name: 'properties.typology.livingArea.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          classNameBox: 'brdRadius max-w-fix-md-288',
          placeholder: translateTo(lang, 'e.g. 120'),
        },
      ],
      successMessage: translateTo(lang, 'Great living space.'),
    },
    {
      title: translateTo(lang, 'What is the construction year?'),
      history: 'constructionYear',
      cardType: 'constructionYear',
      bgImg: yearSvg,
      inputs: [
        {
          component: BrixelInputText,
          label: 'Construction year',
          name: 'properties.building.built',
          type: 'number',
          classNameBox: 'brdRadius max-w-fix-md-232',
          placeholder: translateTo(lang, 'e.g. 1990'),
          validation: [minLengthNumYear, Validation.positiveNumber, maxLengthNumYear, Validation.required],
          minLenghtNum: 999,
          maxLenghtNum: 9999,
        },
      ],
      successMessage: translateTo(lang, 'A good year for real estate.'),
    },
    {
      title: translateTo(lang, 'What is the location?'),
      history: 'locationInput',
      cardType: 'locationInput',
      bgImg: locationSvg,
      inputs: [
        {
          className: 'pos-r zIndex6',
          classNameBox: 'max-w-perc-65',
          component: BrixelSelect,
          label: 'Country',
          name: 'location.countryCode',
          options: countryList,
          validation: [Validation.required],
        },
        {
          component: Maps,
          showMap: true,
          name: 'location.latitude',
          type: 'Map',
          mapOptions: {
            showMap: true,
            hideSearch: false,
            showSelectCountry: true,
            multipleFieldSearch: true,
            draggable: true,
          },
          validation: [Validation.required],
        },
      ],
      successMessage: translateTo(lang, 'That is an interesting location.'),
    },
    {
      title: `${translateTo(lang, 'Great, Your property was created!')} 🎉`,
      history: 'resume',
      className: 'willAnimate',
      bgImg: congratsSvg,
      cardType: 'loadComponent',
      component: ResumeCard,
    },
    {
      conditions: [{
        name: 'owner',
        value: null,
      }],
      history: 'createProfile',
      component: LoginSignup,
      bgImg: congratsSvg,
      signupTitle: translateTo(lang, 'Create your profile to save your progress.'),
      loginTitle: translateTo(lang, 'Login to your profile to save your progress.'),
      effect: 'slideUp',
      cardType: 'createProfile',
      inputs: [{
        component: LoginSignup,
        name: 'profile',
        validation: [Validation.required],
      }],
    },
    {
      history: 'savingData',
      cardType: 'createProfile',
      toSave: true,
    },
  ];
};
