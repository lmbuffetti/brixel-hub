import {
  BrixelRadioButton,
  BrixelInputStepNumber,
  BrixelInputText,
  Validation,
  FactsOptions,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import LoginSignup from '../components/LoginSignup';
import ResumeCard from '../components/ResumeCard';
import { translateTo } from '../utils/translation';
import { configureStore } from '../store';

import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
import commercial from '../images/BrxielComingTown/commercial.svg';

import homesSvg from '../images/getstarted/svgs/homes.svg';
import spaceSvg from '../images/getstarted/svgs/space.svg';
import locationSvg from '../images/getstarted/svgs/location.svg';
import roomsSvg from '../images/getstarted/svgs/room.svg';
import congratsSvg from '../images/getstarted/svgs/congrats.svg';
import yearSvg from '../images/getstarted/svgs/year.svg';
import userType from '../images/getstarted/svgs/userType.svg';
import { BestimateQuestions } from './Bestimate';
import MapsWithModalManual from '../components/Map/MapsWithModalManual';

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

const minLengthNumYear = minLengthNum(1500, 'year');
const maxLengthNumRooms = maxLengthNum(31, 'rooms');
const maxLengthNumLivSpace = maxLengthNum(9999, 'living space');
const maxLengthNumYear = maxLengthNum(2031, 'year');

// QUESTION LISTS
export const QuestionsList = (lang, country = 'CH') => {
  let propertyType = '';
  if (configureStore) {
    propertyType = get(configureStore.getState(), 'brixelForm.GetStarted.values.properties.propertyType', '');
  }
  let livingAreaTitle = country === 'PT' ? translateTo(lang, 'What is the gross area size?') : translateTo(lang, 'What is the living space size?');
  if (propertyType === 'Commercial') livingAreaTitle = translateTo(lang, 'What is the floor size?');
  const countryCode = get(configureStore.getState(), 'brixelForm.GetStarted.values.location.countryCode', '');
  return [
    {
      title: translateTo(lang, 'What is the estimation for?'),
      history: 'estimationType',
      vCentered: true,
      bgImg: userType,
      footerWidth: 'max-w-fix-464',
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        pdClass: 'py-2 py-lg-3 px-1',
        label: '',
        ReduxFieldClass: 'max-w-fix-464 m-a',
        name: 'estimationType',
        validation: [Validation.required],
        icons: true,
        options: factsOptions.userTypeEstimation,
      }],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: translateTo(lang, 'What type of property do you want to estimate?'),
      history: 'propertyType',
      vCentered: true,
      footerWidth: 'max-w-fix-464',
      bgImg: homesSvg,
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        ReduxFieldClass: 'max-w-fix-464 m-a',
        pdClass: 'py-2 py-lg-3 px-1',
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
          {
            label: translateTo(lang, 'Commercial'),
            value: 'Commercial',
            img: commercial,
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
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          component: BrixelInputStepNumber,
          classNameBox: 'max-w-fix-384 w-perc-100 fieldHolder bgWhite brdRadius px-2 px-sm-5 py-5 m-a',
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
      title: livingAreaTitle,
      history: 'livingSpace',
      cardType: 'livingSpace',
      bgImg: spaceSvg,
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          condition: [{
            name: 'properties.propertyType',
            noValue: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-600 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          label: country === 'PT' ? 'Gross area' : 'Net living space',
          name: country === 'PT' ? 'properties.typology.grossArea.value' : 'properties.typology.livingArea.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          placeholder: translateTo(lang, 'e.g. 120'),
          maxLenghtNum: 9999,
        },
        {
          condition: [{
            name: 'properties.propertyType',
            value: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-600 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          label: 'Floor space',
          name: 'properties.typology.floorSpace.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          placeholder: translateTo(lang, 'e.g. 120'),
          maxLenghtNum: 9999,
        },
      ],
      successMessage: translateTo(lang, 'Great living space.'),
    },
    {
      title: translateTo(lang, 'What is the construction year?'),
      history: 'constructionYear',
      cardType: 'constructionYear',
      footerWidth: 'max-w-fix-600',
      bgImg: yearSvg,
      inputs: [
        {
          component: BrixelInputText,
          label: 'Construction year',
          name: 'properties.building.built',
          type: 'number',
          classNameBox: 'brdRadius max-w-fix-600 w-perc-100 px-5 py-5 brdRadius fieldHolder bgWhite m-a',
          placeholder: translateTo(lang, 'e.g. 1990'),
          validation: [Validation.positiveNumber, maxLengthNumYear, minLengthNumYear, Validation.required],
          maxLenghtNum: 9999,
          minLengthNum: 999,
        },
      ],
      successMessage: translateTo(lang, 'A good year for real estate.'),
    },
    {
      title: translateTo(lang, 'What is the location?'),
      history: 'locationInput',
      cardType: 'locationInput',
      bgImg: locationSvg,
      footerWidth: 'max-w-fix-600',
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 w-perc-100 m-a px-2 px-sm-5 py-5 dis-f flex-wrap',
      inputs: [
        {
          component: MapsWithModalManual,
          showMap: false,
          name: 'location.latitude',
          type: 'Map',
          classBoxWrapper: 'w-perc-100 flex-1 pl-2 searchMapFields',
          mapOptions: {
            showMap: false,
            hideSearch: false,
            showSelectCountry: true,
            multipleFieldSearch: true,
            draggable: true,
          },
        },
      ],
      successMessage: translateTo(lang, 'That is an interesting location.'),
    },
    {
      title: translateTo(lang, 'Is this your correct location?'),
      history: 'locationInputResume',
      cardType: 'locationInputResume',
      bgImg: locationSvg,
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: MapsWithModalManual,
          showMap: true,
          name: 'location.latitude',
          type: 'Map',
          classBoxWrapper: 'brdRadius max-w-fix-600 w-perc-100 px-2 px-sm-5 py-5 brdRadius fieldHolder bgWhite m-a',
          widthBox: '100',
          mapOptions: {
            showMap: true,
            hideSearch: true,
            showSelectCountry: false,
            multipleFieldSearch: false,
            draggable: false,
          },
          validation: [Validation.required],
        },
      ],
    },
    {
      title: `${translateTo(lang, 'Great, Your property was created!')} 🎉`,
      history: 'resume',
      bgImg: congratsSvg,
      cardType: 'loadComponent',
      component: ResumeCard,
    },
    ...BestimateQuestions('getStarted', countryCode),
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
