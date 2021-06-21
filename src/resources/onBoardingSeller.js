/* eslint-disable max-len */
import {
  BrixelRadioButton,
  BrixelInputStepNumber,
  BrixelInputText,
  Validation,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import MapsWithModalManual from '../components/Map/MapsWithModalManual';
import LoginSignup from '../components/LoginSignup';
import ResumeCard from '../components/ResumeCard';
import { translateTo } from '../utils/translation';
import { configureStore } from '../store';
import { svgIcons } from './svgIcons';

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
  return [
    {
      title: translateTo(lang, 'What type of property do you have?'),
      history: 'propertyType',
      footerWidth: 'max-w-fix-880',
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        ReduxFieldClass: '',
        label: '',
        name: 'properties.propertyType',
        validation: [Validation.required],
        icons: true,
        cardLayout: true,
        cardSmall: true,
        svgSupport: true,
        pdClass: 'py-3',
        isHorizontal: true,
        options: [
          {
            label: translateTo(lang, 'Apartment'),
            value: 'Apartment',
            img: svgIcons.apartment,
            color: 'blue',
          },
          {
            label: translateTo(lang, 'House'),
            value: 'House',
            img: svgIcons.house,
            color: 'blue',
          },
          {
            label: translateTo(lang, 'Commercial'),
            value: 'Commercial',
            img: svgIcons.commercial,
            color: 'blue',
          },
        ],
      }],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: translateTo(lang, 'How many rooms?'),
      history: 'allRooms',
      cardType: 'allRooms',
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          component: BrixelInputStepNumber,
          classNameBox: 'max-w-fix-384 w-perc-100 fieldHolder bgWhite brdRadius py-6 px-5 m-a',
          label: 'Number of rooms',
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
      footerWidth: 'max-w-fix-384',
      showSendButton: false,
      inputs: [
        {
          condition: [{
            name: 'properties.propertyType',
            noValue: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          className: '',
          label: country === 'PT' ? 'Gross area' : 'Net living space',
          name: country === 'PT' ? 'properties.typology.grossArea.value' : 'properties.typology.livingArea.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          placeholder: '117',
          maxLengthNum: 9999,
        },
        {
          condition: [{
            name: 'properties.propertyType',
            value: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          className: '',
          label: 'Floor space',
          name: 'properties.typology.floorSpace.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          placeholder: translateTo(lang, 'e.g. 120'),
          maxLengthNum: 9999,
        },
      ],
      successMessage: translateTo(lang, 'Great living space.'),
    },
    {
      title: translateTo(lang, 'What is the construction year?'),
      history: 'constructionYear',
      cardType: 'constructionYear',
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          component: BrixelInputText,
          label: 'Construction year',
          name: 'properties.building.built',
          type: 'number',
          classNameBox: 'brdRadius max-w-fix-384 w-perc-100 px-2 px-sm-5 py-5 brdRadius fieldHolder bgWhite m-a',
          placeholder: translateTo(lang, 'e.g. 1990'),
          validation: [Validation.positiveNumber, maxLengthNumYear, minLengthNumYear, Validation.required],
          maxLengthNum: 9999,
          minLengthNum: 999,
        },
      ],
      successMessage: translateTo(lang, 'A good year for real estate.'),
    },
    {
      title: translateTo(lang, 'What is the location?'),
      history: 'locationInput',
      cardType: 'locationInput',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: MapsWithModalManual,
          showMap: false,
          name: 'location.searchAddress',
          type: 'Map',
          classNameBox: 'brdRadius max-w-fix-600 w-perc-100 px-2 px-sm-5 py-5 brdRadius fieldHolder bgWhite m-a',
          classBoxWrapper: 'mt-0 searchMapFields',
          validation: [Validation.required],
          mapOptions: {
            showMap: false,
            hideSearch: false,
            showSelectCountry: true,
            multipleFieldSearch: true,
            draggable: true,
          },
        },
      ],
    },
    {
      title: translateTo(lang, 'Is this your correct location?'),
      history: 'locationInputResume',
      cardType: 'locationInputResume',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: MapsWithModalManual,
          showMap: true,
          name: 'location.latitude',
          type: 'Map',
          classBoxWrapper: 'brdRadius max-w-fix-600 w-perc-100 pb-3 pb-sm-5 brdRadius fieldHolder bgWhite m-a',
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
      cardType: 'loadComponent',
      component: ResumeCard,
      btnLabel: 'Continue',
    },
    {
      conditions: [{
        name: 'owner',
        value: null,
      }],
      history: 'createProfile',
      component: LoginSignup,
      signupTitle: translateTo(lang, 'Create your profile to save your progress.'),
      loginTitle: translateTo(lang, 'Login to your profile to save your progress.'),
      cardType: 'createProfile',
      inputs: [{
        component: LoginSignup,
        name: 'register.name',
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
