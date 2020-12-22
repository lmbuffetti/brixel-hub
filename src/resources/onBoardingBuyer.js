import {
  BrixelRadioButton,
  BrixelCheckbox,
  BrixelExtraFeature,
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelInputRange,
  BrixelSelect,
  Validation,
  FactsOptions,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import MapsCities from '../components/Map/MapsCities';
import LoginSignup from '../components/LoginSignup';
import { translateTo } from '../utils/translation';
import { configureStore } from '../store';

import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';

import homesSvg from '../images/getstarted/svgs/homes.svg';
import locationSvg from '../images/getstarted/svgs/location.svg';
import roomsSvg from '../images/getstarted/svgs/room.svg';
import congratsSvg from '../images/getstarted/svgs/congrats.svg';

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
  const formValue = {};
  let country = 'CH';
  let propertyType = '';
  if (configureStore) {
    countryList = get(configureStore.getState(), 'common.country', []);
    propertyType = get(configureStore.getState(), 'brixelForm.GetStarted.values.properties.propertyType', '');
    country = get(configureStore.getState(), 'brixelForm.GetStarted.values.location.countryCode', 'CH');
  }
  let livingAreaTitle = translateTo(lang, 'What is the living space size?');
  if (propertyType === 'Commercial') livingAreaTitle = translateTo(lang, 'What is the floor size?');
  return [
    {
      titleGreen: translateTo(lang, 'Hello, let\'s get started.'),
      title: translateTo(lang, 'What type of property do you have?'),
      history: 'propertyType',
      vCentered: true,
      bgImg: homesSvg,
      inputs: [
        {
          component: BrixelCheckbox,
          className: 'radioBtnImg max-w-fix-md-464',
          pdClass: 'py-2 py-md-3 px-1',
          label: '',
          name: 'characteristics.propertyType',
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
            {
              label: 'Building land',
              value: 'Building land',
              img: house,
            },
          ],
        },
      ],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: translateTo(lang, 'How many rooms?'),
      history: 'tipology',
      vCentered: true,
      bgImg: homesSvg,
      inputs: [
        {
          component: BrixelInputStepNumber,
          classNameBox: 'max-w-fix-md-232',
          label: 'Tipology',
          name: 'characteristics.bedrooms',
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
          name: 'characteristics',
          type: 'number',
          validation: [Validation.required],
          unit: 'm2',
          classNameBox: 'brdRadius max-w-fix-md-288',
          maxLenghtNum: 9999,
        },
      ],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: 'Extra Feature',
      history: 'extraFeature',
      vCentered: true,
      bgImg: homesSvg,
      inputs: [
        {
          component: BrixelExtraFeature,
          className: 'max-w-fix-md-232',
          name: 'characteristics.extraFeatures',
          type: 'number',
          validation: [Validation.required],
          classNameBox: 'brdRadius max-w-fix-md-288',
        },
      ],
      successMessage: translateTo(lang, 'Ok. Got it.'),
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
          component: MapsCities,
          showMap: false,
          name: 'locations[0].latitude',
          type: 'Map',
          mapOptions: {
            showMap: false,
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
      title: translateTo(lang, 'What is your budget?'),
      history: 'price',
      cardType: 'Price',
      bgImg: roomsSvg,
      inputs: [
        {
          component: BrixelInputText,
          className: '',
          label: `Max. selling price in ${get(formValue, 'price.currency', 'CHF')}`,
          placeholder: '800’000',
          name: 'finance.price.totalMax',
          formatType: 'price',
          unit: get(formValue, 'price.currency', 'CHF'),
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.'),
    },
    {
      title: translateTo(lang, 'How is your knowledge about buying a property?'),
      history: 'knowledge',
      cardType: 'Knowledge',
      bgImg: roomsSvg,
      inputs: [
        {
          component: BrixelRadioButton,
          pdClass: 'py-2 py-md-3 px-1',
          icons: true,
          label: '',
          name: 'knowledge',
          validation: [Validation.required],
          options: factsOptions.buyerKnowledge,
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.'),
    },
    {
      title: translateTo(lang, 'What is your current living situation?'),
      history: 'livingSituation',
      cardType: 'LivingSituation',
      bgImg: roomsSvg,
      inputs: [
        {
          component: BrixelRadioButton,
          pdClass: 'py-2 py-md-3 px-1',
          icons: true,
          label: '',
          name: 'livingSituation',
          validation: [Validation.required],
          options: factsOptions.buyerLivingSituation,
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.'),
    },
    {
      title: translateTo(lang, 'What is your family situation?'),
      history: 'familySituation',
      cardType: 'FamilySituation',
      bgImg: roomsSvg,
      inputs: [
        {
          component: BrixelRadioButton,
          pdClass: 'py-2 py-md-3 px-1',
          icons: true,
          label: '',
          name: 'familySituation',
          validation: [Validation.required],
          options: factsOptions.buyerFamilySituation,
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.'),
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
