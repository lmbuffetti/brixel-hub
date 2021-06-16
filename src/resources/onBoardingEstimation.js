/* eslint-disable max-len */
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
/*
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
import commercial from '../images/BrxielComingTown/commercial.svg'; */

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
    ...BestimateQuestions('getStarted', countryCode, propertyType),
    {
      title: translateTo(lang, 'What is the estimation for?'),
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
        icons: true,
        options: factsOptions.userTypeEstimation,
      }],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: translateTo(lang, 'What type of property do you want to estimate?'),
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
        pdClass: '',
        isHorizontal: true,
        options: [
          {
            label: translateTo(lang, 'Apartment'),
            value: 'Apartment',
            img: "<svg class='svg-content' viewBox='0 0 200 111' fill='none' xmlns='http://www.w3.org/2000/svg'><path class='willtrans whiteHover' fill-rule='evenodd' clip-rule='evenodd' d='M84.981 72c.012-.23.019-.462.019-.696 0-7.323-6.047-13.259-13.508-13.259-.483 0-.96.025-1.43.074-3.463.359-6.806-1.146-8.942-3.845C57.62 49.849 52.15 47 46 47c-6.238 0-11.777 2.93-15.269 7.463-2.01 2.608-5.247 4.085-8.552 3.683a13.84 13.84 0 00-1.671-.1C13.048 58.045 7 63.98 7 71.303c0 .234.007.465.019.696H84.98zM189 36c-3.228-4.434-8.564-7.34-14.613-7.34-1.287 0-2.541.132-3.749.384-4.527.94-9.214.34-13.259-1.831-5-2.684-10.758-4.213-16.888-4.213-11.185 0-21.131 5.095-27.491 13h76z' fill='#D8EDF0'/><path d='M163.065 55.925a12.44 12.44 0 00.082-3.784c-.717-5.519-5.21-9.914-10.742-10.523-7.379-.811-13.623 4.945-13.623 12.16 0 .806.078 1.593.226 2.356.703 3.593-.339 7.298-2.721 10.08a19.324 19.324 0 00-4.628 13.582c.48 9.71 8.264 17.67 17.963 18.35 11.336.794 20.778-8.168 20.778-19.334 0-4.79-1.737-9.173-4.616-12.555-2.433-2.86-3.374-6.636-2.719-10.332zM137 43H59l13.748-21h49.816L137 43z' fill='#1ECAD3'/><path d='M110 14L92 43.143V110h36V43.143L110 14z' fill='#84DADE'/><path d='M137 43H83v67h54V43z' fill='#84DADE'/><path d='M83 43H61v67h22V43z' fill='#004A98'/><path d='M115 62h-10v15h10V62z' fill='#fff'/><path d='M115 39h-10v16h10V39z' fill='#004A98'/><path d='M99 62H89v15h10V62z' fill='#fff'/><path d='M130 62h-10v15h10V62z' fill='#004A98'/><path d='M115 87h-10v15h10V87z' fill='#fff'/><path d='M99 87H89v15h10V87z' fill='#004A98'/><path d='M130 87h-10v15h10V87z' fill='#fff'/><path d='M151.018 67.28v42.736M143.433 72.973l7.585 7.585M150.863 90.021l11.57-11.569' stroke='#323E48' stroke-width='2' stroke-miterlimit='10' stroke-linejoin='round'/><path d='M1.6 109.5h196.9' fill='none' stroke='#323e48' stroke-width='1' stroke-linejoin='round' stroke-miterlimit='29.324'/></svg>",
            color: 'blue',
          },
          {
            label: translateTo(lang, 'House'),
            value: 'House',
            img: "<svg preserveAspectRatio='xMidYMid meet' class='svg-content' version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0' y='0' viewBox='0 0 200 110' xml:space='preserve'><style>.st3{fill:#1ecad3}.st4{fill:#004a98}.st5{fill:#9fe1e5}.st7{fill:#84dade}</style><defs><path id='SVGID_1_' d='M1.6 36.8h196.9V110H1.6z'/></defs><clipPath id='SVGID_2_'><use xlink:href='#SVGID_1_' overflow='visible'/></clipPath><g clip-path='url(#SVGID_2_)'><path class='willtrans whiteHover' d='M85.2 48.8c-3.3-4.9-8.9-8-15.2-8-1.8 0-3.6.3-5.4.8-2.9.9-6.1.6-8.7-1.1-3.8-2.3-8.2-3.7-12.8-3.7-8.9 0-16.4 4.9-20.5 12h62.6zM114 77.7c4.3-3.9 9.9-6.2 16.2-6.2h1.2c4.2.2 8.3-1.1 11.5-3.6 5.7-4.6 13-7.3 21-7.3 12.7 0 23.6 6.9 29.5 17.1H114z' fill-rule='evenodd' clip-rule='evenodd' fill='#d8edf0'/><path class='st3' d='M164.7 76h-40.4v33.5h40.4V76z'/><path class='st4' d='M167.8 73.9h-44.1v3.8h44.1v-3.8z'/><path class='st5' d='M78.4 77.6v31.9h63v-67l-63 35.1z'/><path class='st4' d='M78.3 76H44.9v33.5h33.5V76z'/><path class='st3' d='M37.4 78.4h44.3l64.8-38h-41.8l-67.3 38z'/><path d='M100.1 84.8h-7.4v14h7.4v-14zm16.3 0H109v14h7.4v-14zm39.8 0h-7.4v14h7.4v-14zm-23.6 0h-7.4v14h7.4v-14z' fill='#fff'/><path class='st4' d='M80.4 48.8H73v14h7.4v-14z'/><path class='st5' d='M85 48.8h-7.4v14H85v-14z'/><path class='st7' d='M56.6 109.5c0-11.2-9-20.2-20.2-20.2s-20.2 9-20.2 20.2h40.4z'/><path class='st7' d='M73.2 109.5c-1.6-6.3-7.2-11-13.9-11s-12.4 4.7-13.9 11h27.8z'/><path d='M1.6 109.5h196.9' fill='none' stroke='#323e48' stroke-width='1' stroke-linejoin='round' stroke-miterlimit='29.324'/></g></svg>",
            color: 'blue',
          },
          {
            label: translateTo(lang, 'Commercial'),
            value: 'Commercial',
            img: "<svg preserveAspectRatio='xMidYMid meet' class='svg-content' viewBox='0 0 200 111' fill='none' xmlns='http://www.w3.org/2000/svg'><path class='willtrans whiteHover' fill-rule='evenodd' clip-rule='evenodd' d='M100.05 57.48v-.691a13.502 13.502 0 00-13.545-13.545c-.494 0-.988 0-1.483.1-3.46.395-6.821-1.187-8.996-3.955-3.46-4.548-8.997-7.514-15.126-7.514-6.229 0-11.864 2.966-15.324 7.612-1.977 2.67-5.24 4.153-8.601 3.757-.593-.099-1.088-.099-1.68-.099A13.502 13.502 0 0021.75 56.69v.692h78.3v.099z' fill='#D8EDF0'/><path d='M161.147 93.664c11.958 0 21.651-9.693 21.651-21.65 0-11.958-9.693-21.652-21.651-21.652-11.957 0-21.651 9.694-21.651 21.651 0 11.958 9.694 21.651 21.651 21.651z' fill='#1ECAD3'/><path d='M161.641 61.237v48.542M154.028 66.971l7.613 7.613M161.542 84.075l11.567-11.567' stroke='#323E48' stroke-width='2' stroke-miterlimit='10' stroke-linejoin='round'/><path d='M148.987 21H94.81v88.779h54.177V21z' fill='#84DADE'/><path d='M123.183 21h-1.384v89.076h1.384V21z' fill='#fff'/><path d='M148.987 57.381H94.315v1.384h54.672v-1.384zM148.987 75.573H94.315v1.384h54.672v-1.384zM148.987 39.19H94.315v1.385h54.672v-1.384zM148.987 93.862H94.315v1.384h54.672v-1.384z' fill='#fff'/><path d='M137.42 21h-1.384v89.076h1.384V21zM108.947 21h-1.384v88.779h1.384V21z' fill='#fff'/><path d='M94.81 21H60.998v88.779H94.81V21z' fill='#004A98'/><path d='M1.6 109.5h196.9' fill='none' stroke='#323e48' stroke-width='1' stroke-linejoin='round' /></svg>",
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
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          condition: [{
            name: 'properties.propertyType',
            noValue: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          label: country === 'PT' ? 'Gross area' : 'Net living space',
          name: country === 'PT' ? 'properties.typology.grossArea.value' : 'properties.typology.livingArea.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          placeholder: '117',
          maxLenghtNum: 9999,
        },
        {
          condition: [{
            name: 'properties.propertyType',
            value: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
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
      successMessage: translateTo(lang, 'That is an interesting location.'),
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
    ...BestimateQuestions('getStarted', countryCode, propertyType),
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
