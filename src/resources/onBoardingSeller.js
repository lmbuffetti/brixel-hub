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
            img: "<svg width='100%' height='100%' preserveAspectRatio='xMidYMid meet' class='svg-content' viewBox='0 0 203 98' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0)'><path class='willtrans whiteHover' fill-rule='evenodd' clip-rule='evenodd' d='M85.214 58.839c.012-.24.019-.48.019-.721 0-7.586-6.15-13.735-13.735-13.735-.491 0-.976.026-1.454.076-3.521.372-6.921-1.187-9.092-3.983-3.56-4.584-9.122-7.535-15.375-7.535-6.342 0-11.974 3.035-15.525 7.73-2.043 2.703-5.335 4.233-8.696 3.816a13.816 13.816 0 00-1.7-.104c-7.585 0-13.734 6.149-13.734 13.735 0 .242.007.482.019.72h79.273zM191.011 22.14c-3.29-4.691-8.73-7.766-14.896-7.766-1.312 0-2.59.14-3.821.406-4.615.996-9.392.36-13.516-1.937a35.252 35.252 0 00-17.214-4.458c-11.402 0-21.54 5.39-28.023 13.756h77.47z' fill='#D8EDF0'/><path d='M164.505 42.11a12.62 12.62 0 00.083-3.84c-.728-5.602-5.288-10.063-10.904-10.681-7.49-.824-13.828 5.019-13.828 12.343 0 .818.079 1.617.23 2.39.713 3.648-.345 7.409-2.762 10.232a19.612 19.612 0 00-4.698 13.787c.487 9.857 8.388 17.937 18.233 18.626 11.507.806 21.091-8.29 21.091-19.625 0-4.862-1.763-9.311-4.685-12.744-2.47-2.903-3.425-6.735-2.76-10.487zM137.564 29.45H58.578L72.5 7.176h50.446l14.618 22.276z' fill='#1ECAD3'/><path d='M110.252 0L91.906 29.451v67.565h36.692V29.451L110.252 0z' fill='#84DADE'/><path d='M137.563 29.451H82.94v67.566h54.623V29.451z' fill='#84DADE'/><path d='M82.941 29.451H60.665v67.566h22.276V29.451z' fill='#004A98'/><path d='M115.3 48.03h-9.865v15.62h9.865V48.03z' fill='#fff'/><path d='M115.3 25.116h-9.865v15.621h9.865v-15.62z' fill='#004A98'/><path d='M99.677 48.03h-9.865v15.62h9.865V48.03z' fill='#fff'/><path d='M130.923 48.03h-9.865v15.62h9.865V48.03z' fill='#004A98'/><path d='M115.3 73.259h-9.865v15.62h9.865V73.26z' fill='#fff'/><path d='M99.677 73.259h-9.865v15.62h9.865V73.26z' fill='#004A98'/><path d='M130.923 73.259h-9.865v15.62h9.865V73.26z' fill='#fff'/><path d='M152.276 53.636v43.38M144.577 59.415l7.699 7.699M152.119 76.72l11.744-11.743' stroke='#323E48' stroke-width='2' stroke-miterlimit='10' stroke-linejoin='round'/><path d='M0 97.016h202.282' stroke='#323E48' stroke-miterlimit='10' stroke-linejoin='round'/></g><defs><clipPath id='clip0'><path fill='#fff' d='M0 0h202.282v97.516H0z'/></clipPath></defs></svg>",
            color: 'blue',
          },
          {
            label: translateTo(lang, 'House'),
            value: 'House',
            img: "<svg width='100%' height='100%' preserveAspectRatio='xMidYMid meet' class='svg-content' viewBox='0 0 203 76' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0)'><path class='willtrans whiteHover' fill-rule='evenodd' clip-rule='evenodd' d='M85.9 12.3c-3.4-5-9.1-8.2-15.6-8.2-1.9 0-3.7.3-5.5.8-3 .9-6.3.6-8.9-1.1C52 1.4 47.5 0 42.7 0c-9.1 0-16.9 5-21.1 12.3h64.3zM115.5 42c4.4-4 10.2-6.4 16.6-6.4h1.2c4.3.2 8.5-1.1 11.8-3.7 5.9-4.7 13.4-7.5 21.6-7.5 13 0 24.3 7.1 30.3 17.6h-81.5z' fill='#D8EDF0'/><path d='M167.6 40.3h-41.5v34.4h41.5V40.3z' fill='#1ECAD3'/><path d='M170.8 38.1h-45.3V42h45.3v-3.9z' fill='#004A98'/><path d='M79 41.9v32.8h64.7V5.8L79 41.9z' fill='#9FE1E5'/><path d='M78.9 40.3H44.5v34.4h34.4V40.3z' fill='#004A98'/><path d='M36.8 42.7h45.5l66.6-39.1h-43L36.8 42.7z' fill='#1ECAD3'/><path d='M101.3 49.3h-7.6v14.4h7.6V49.3zM118 49.3h-7.6v14.4h7.6V49.3zM158.9 49.3h-7.6v14.4h7.6V49.3zM134.7 49.3h-7.6v14.4h7.6V49.3z' fill='#fff'/><path d='M81 12.3h-7.6v14.4H81V12.3z' fill='#004A98'/><path d='M85.7 12.3h-7.6v14.4h7.6V12.3z' fill='#9FE1E5'/><path d='M56.6 74.7c0-11.5-9.3-20.8-20.8-20.8S15 63.2 15 74.7h41.6z' fill='#84DADE'/><path d='M73.6 74.7c-1.6-6.5-7.4-11.3-14.3-11.3S46.6 68.2 45 74.7h28.6z' fill='#84DADE'/><path d='M0 74.7h202.3' stroke='#323E48' stroke-miterlimit='10' stroke-linejoin='round'/></g><defs><clipPath id='clip0'><path fill='#fff' d='M0 0h202.3v75.2H0z'/></clipPath></defs></svg>",
            color: 'blue',
          },
          {
            label: translateTo(lang, 'Commercial'),
            value: 'Commercial',
            img: "<svg width='100%' height='100%' preserveAspectRatio='xMidYMid meet' class='svg-content' viewBox='0 0 203 97' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0)'><path class='willtrans whiteHover' fill-rule='evenodd' clip-rule='evenodd' d='M101.2 42.9v-.7c0-7.6-6.1-13.7-13.7-13.7-.5 0-1 0-1.5.1-3.5.4-6.9-1.2-9.1-4C73.4 20 67.8 17 61.6 17c-6.3 0-12 3-15.5 7.7-2 2.7-5.3 4.2-8.7 3.8-.6-.1-1.1-.1-1.7-.1-7.6 0-13.7 6.1-13.7 13.7v.7h79.2v.1z' fill='#D8EDF0'/><path d='M163 79.5c12.095 0 21.9-9.805 21.9-21.9 0-12.095-9.805-21.9-21.9-21.9-12.095 0-21.9 9.805-21.9 21.9 0 12.095 9.805 21.9 21.9 21.9z' fill='#1ECAD3'/><path d='M163.5 46.7v49.1M155.8 52.5l7.7 7.7M163.4 69.8l11.7-11.7' stroke='#323E48' stroke-width='2' stroke-miterlimit='10' stroke-linejoin='round'/><path d='M150.7 6H95.9v89.8h54.8V6z' fill='#84DADE'/><path d='M124.6 6h-1.4v90.1h1.4V6z' fill='#fff'/><path d='M150.7 42.8H95.4v1.4h55.3v-1.4zM150.7 61.2H95.4v1.4h55.3v-1.4zM150.7 24.4H95.4v1.4h55.3v-1.4zM150.7 79.7H95.4v1.4h55.3v-1.4z' fill='#fff'/><path d='M139.001 6h-1.4v90.1h1.4V6zM110.201 6h-1.4v89.8h1.4V6z' fill='#fff'/><path d='M95.9 6H61.7v89.8h34.2V6z' fill='#004A98'/><path d='M0 96.2h202.3' stroke='#323E48' stroke-miterlimit='10' stroke-linejoin='round'/></g><defs><clipPath id='clip0'><path fill='#fff' d='M0 0h202.3v96.7H0z'/></clipPath></defs></svg>",
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
          maxLenghtNum: 9999,
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
      className: 'willAnimate',
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
