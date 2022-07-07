/* eslint-disable max-len */
import { FactsOptions, translateTo } from '@brixel/brixel-components';
import {
  BrixelRadioButton,
  BrixelInputStepNumber,
  BrixelInputText,
  Validation,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import LoginSignup from '../../components/LoginSignup';
// import ResumeCard from '../components/ResumeCard';
import { configureStore } from '../../store';
import { svgIcons } from '../Utilities/svgIcons';

import { BestimateQuestions } from './Bestimate';
import MapsWithModalManual from '../../components/Map/MapsWithModalManual';

const { factsOptions } = FactsOptions;

// VALIDATION OF FIELDS
export const maxLengthNum = (val, name) => (value) => {
  let error = null;
  if (value && value >= val) {
    error = translateTo(name === 'year' ? `Year can't be after ${val}` : `The ${name} have to be less then ${val}`);
  }
  return error;
};

export const minLengthNum = (val, name) => (value) => {
  let error = null;
  if (value && value <= val) {
    error = translateTo(name === 'year' ? `Too old! year can't be before ${val}` : `The ${name} have to be more then ${val}`);
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
  let livingAreaTitle = country === 'PT' ? translateTo('What is the gross area size?') : translateTo( 'What is the living space size?');
  if (propertyType === 'Commercial') livingAreaTitle = translateTo( 'What is the floor size?');
  const countryCode = get(configureStore.getState(), 'brixelForm.GetStarted.values.location.countryCode', '');
  
  const userTypeEstimation = factsOptions.userTypeEstimation.map((item) => ({
    ...item,
    label: translateTo(item.label)
  }));

  return [
    {
      title: translateTo( 'What is the estimation for?'),
      history: 'estimationType',
      footerWidth: 'max-w-fix-464',
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        pdClass: 'py-2 py-lg-3 px-2',
        label: '',
        ReduxFieldClass: 'max-w-fix-464 m-a',
        name: 'estimationType',
        validation: [Validation.required],
        large: true,
        icons: true,
        options: userTypeEstimation,
      }],
      successMessage: translateTo( 'Ok. Got it.'),
    },
    {
      title: translateTo( 'What type of property do you want to estimate?'),
      /* subtitle: translateTo( 'Choose between apartment and house.'), */
      history: 'propertyType',
      footerWidth: 'max-w-fix-584',
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        classNameBox: 'max-w-fix-584 ml-a mr-a',
        ReduxFieldClass: '',
        label: '',
        name: 'properties.propertyType',
        validation: [Validation.required],
        icons: true,
        cardLayout: true,
        cardSmall: true,
        svgSupport: true,
        svgWidth: 'max-w-fix-120 max-w-fix-sm-200',
        pdClass: 'py-sm-5',
        isHorizontal: true,
        options: [
          {
            label: translateTo( 'Apartment'),
            value: 'Apartment',
            img: svgIcons.apartment,
            color: 'blue',
          },
          {
            label: translateTo( 'House'),
            value: 'House',
            img: svgIcons.house,
            color: 'blue',
          },
        ],
      }],
      successMessage: translateTo( 'Ok. Got it.'),
    },
    {
      title: translateTo( 'How many rooms?'),
      history: 'allRooms',
      cardType: 'allRooms',
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          component: BrixelInputStepNumber,
          classNameBox: 'max-w-fix-384 w-perc-100 fieldHolder bgWhite brdRadius px-2 px-sm-5 py-5 m-a',
          label: translateTo('Number of rooms'),
          name: 'properties.typology.bedrooms',
          validation: [maxLengthNumRooms, Validation.required],
          step: 0.5,
          placeholder: country === 'PT' ? 'T3' : '3',
          formatType: country === 'PT' ? 'rooms-pt' : '',
          min: 0,
          max: 30,
          fluid: true,
          startFrom: 3,
          large: true,
          tooltip: {
            label: translateTo('What is this?'),
            description: translateTo(country === 'PT' ? 'Enter the number of rooms, including rooms with a minimum surface of 9 m² (+1). Kitchen and bathrooms are not counted as a proper room.' : 'Enter the number of rooms that have a minimum surface of 8 m². Kitchen and bathrooms are not counted as a proper room.'),
          }
        },
      ],
      successMessage: translateTo( 'This is a nice number.'),
    },
    {
      title: translateTo(livingAreaTitle),
      history: 'livingSpace',
      cardType: 'livingSpace',
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          condition: [{
            name: 'properties.propertyType',
            noValue: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          label: translateTo(country === 'PT' ? 'Gross area' : 'Net living space'),
          name: country === 'PT' ? 'properties.typology.grossArea.value' : 'properties.typology.livingArea.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          placeholder: '117',
          maxLengthNum: 9999,
          large: true,
          tooltip: {
            label: translateTo('What is this?'),
            description: translateTo(country === 'PT' ? 'It is the total area measured by the external perimeter and axes of the walls or other separating elements of the building or property, including closed private balconies, basements, and private attics with the same use as the building or property. Open balconies, garages, and storage are excluded.' : 'The net living space is the part of the usable surface, which is specified for the primary use of the building. Included are entrance and courtyard, mobile walls, interior stairs, and fireplace. Excluded are external walls, internal walls, chimney, balcony, patio, attic, basement, rooms with room height under 1.2 m, and storerooms.'),
          }
        },
        {
          condition: [{
            name: 'properties.propertyType',
            value: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          label: translateTo('Floor space'),
          name: 'properties.typology.floorSpace.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          placeholder: translateTo( 'e.g. 120'),
          maxLengthNum: 9999,
          large: true,
        },
      ],
      successMessage: translateTo( 'Great living space.'),
    },
    {
      title: translateTo( 'What is the construction year?'),
      history: 'constructionYear',
      cardType: 'constructionYear',
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          component: BrixelInputText,
          label: translateTo('Construction year'),
          name: 'properties.building.built',
          type: 'number',
          classNameBox: 'brdRadius max-w-fix-384 w-perc-100 px-2 px-sm-5 py-5 brdRadius fieldHolder bgWhite m-a',
          placeholder: translateTo( 'e.g. 1990'),
          validation: [Validation.positiveNumber, maxLengthNumYear, minLengthNumYear, Validation.required],
          maxLengthNum: 9999,
          minLengthNum: 999,
          large: true,
        },
      ],
      successMessage: translateTo( 'A good year for real estate.'),
    },
    {
      title: translateTo( 'What is the location?'),
      history: 'locationInput',
      cardType: 'locationInput',
      footerWidth: 'max-w-fix-600',
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 w-perc-100 m-a px-2 px-sm-5 py-5 dis-f flex-wrap',
      inputs: [
        {
          component: MapsWithModalManual,
          showMap: false,
          name: 'location.latitude',
          type: 'Map',
          classBoxWrapper: 'w-perc-100 flex- searchMapFields',
          mapOptions: {
            showMap: false,
            hideSearch: false,
            showSelectCountry: true,
            multipleFieldSearch: true,
            draggable: true,
          },
        },
      ],
      successMessage: translateTo( 'That is an interesting location.'),
    },
    {
      title: translateTo( 'Is this your correct location?'),
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
    /* {
      hideProgress: true,
      title: `${translateTo( 'Great, Your property was created!')} 🎉`,
      history: 'resume',
      cardType: 'loadComponent',
      component: ResumeCard,
      background: 'bgCardGreenDark',
      btnLabel: 'Continue',
    }, */
    ...BestimateQuestions('getStarted', countryCode, propertyType),
    {
      conditions: [{
        name: 'owner',
        value: null,
      }],
      history: 'createProfile',
      background: 'bgCardGreen',
      component: LoginSignup,
      signupTitle: translateTo( 'Create your profile to save your progress.'),
      loginTitle: translateTo( 'Login to your profile to save your progress.'),
      cardType: 'createProfile',
      inputs: [{
        skipPhone: true,
        component: LoginSignup,
        name: 'register.name',
        validation: [Validation.required],
      }],
    },
    {
      hideProgress: true,
      history: 'savingData',
      cardType: 'createProfile',
      toSave: true,
    },
  ];
};
