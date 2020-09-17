import {
  BrixelRadioButton,
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelInputRange,
  BrixelSelect,
  Validation,
  FactsOptions,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import Maps from '../components/Map/Maps';
import LoginSignup from '../components/LoginSignup';
import { translateTo } from '../utils/translation';
import { configureStore } from '../store';

import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';

import homesSvg from '../images/getstarted/svgs/homes.svg';
import locationSvg from '../images/getstarted/svgs/location.svg';
import roomsSvg from '../images/getstarted/svgs/room.svg';
import congratsSvg from '../images/getstarted/svgs/congrats.svg';
import userType from '../images/getstarted/svgs/userType.svg';

const { factsOptions } = FactsOptions;

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

const maxLengthNumRooms = maxLengthNum(31, 'rooms');
const maxLengthNumLivSpace = maxLengthNum(9999, 'living space');

// QUESTION LISTS
export const QuestionsList = (lang) => {
  let countryList = [];
  let formValue = {};
  let country = 'CH';
  if (configureStore) {
    countryList = get(configureStore.getState(), 'common.country', []);
    formValue = get(configureStore.getState(), 'brixelForm.GetStarted.values', []);
    country = get(configureStore.getState(), 'brixelForm.GetStarted.values.location.countryCode', 'CH');
  }
  return [
    {
      titleGreen: translateTo(lang, 'Hello, let\'s get started.'),
      title: translateTo(lang, 'What type of property do you have?'),
      history: 'propertyType',
      vCentered: true,
      bgImg: homesSvg,
      inputs: [
        {
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
        },
        {
          component: BrixelInputStepNumber,
          classNameBox: 'max-w-fix-md-232',
          label: 'Tipology',
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
        {
          component: BrixelInputText,
          className: 'max-w-fix-md-232',
          label: country === 'PT' ? 'Gross area' : 'Net living space',
          name: country === 'PT' ? 'properties.typology.grossArea.value' : 'properties.typology.livingArea.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          classNameBox: 'brdRadius max-w-fix-md-288',
          placeholder: translateTo(lang, 'e.g. 120'),
          maxLenghtNum: 9999,
        },
      ],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: translateTo(lang, 'What is the price?'),
      history: 'price',
      cardType: 'Price',
      bgImg: roomsSvg,
      inputs: [
        {
          component: BrixelInputRange,
          className: '',
          label: 'What is the selling price of the house?',
          labelLeft: 'Price',
          placeholder: '1’500’000',
          name: 'price.total',
          formatType: 'price',
          unit: get(formValue, 'price.currency', 'CHF'),
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.'),
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
            searchType: '(regions)',
          },
          validation: [Validation.required],
        },
      ],
      successMessage: translateTo(lang, 'That is an interesting location.'),
    },
    {
      title: 'How experienced are you?',
      bgImg: userType,
      history: 'typeOfBuyer',
      inputs: [
        {
          component: BrixelRadioButton,
          pdClass: 'py-2 py-md-3 px-1',
          icons: true,
          label: '',
          name: 'register.typeOfBuyer',
          validation: [Validation.required],
          options: factsOptions.userBuyer,
        },
      ],
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
