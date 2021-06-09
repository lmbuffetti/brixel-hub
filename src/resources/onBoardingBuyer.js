/* eslint-disable max-len */
import {
  BrixelRadioButton,
  BrixelCheckbox,
  BrixelExtraFeature,
  BrixelInputMultiRange,
  BrixelInputText,
  BrixelSelect,
  Validation,
  FactsOptions,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import MapsCities from '../components/Map/MapsCities';
import LoginSignup from '../components/LoginSignup';
import { translateTo } from '../utils/translation';
import { configureStore } from '../store';
/*
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
import land from '../images/BrxielComingTown/land.svg'; */

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

// QUESTION LISTS
export const QuestionsList = (lang) => {
  let countryList = [];
  let formValue = {};
  if (configureStore) {
    countryList = get(configureStore.getState(), 'common.country', []);
    formValue = get(configureStore.getState(), 'brixelForm.GetStarted.values', []);
    // country = get(configureStore.getState(), 'brixelForm.GetStarted.values.location.countryCode', 'CH');
  }

  return [
    {
      title: translateTo(lang, 'What kind of property would you like to buy?'),
      history: 'propertyType',
      vCentered: true,
      footerWidth: 'max-w-fix-880',
      inputs: [
        {
          component: BrixelCheckbox,
          className: 'radioBtnImg',
          ReduxFieldClass: '',
          label: '',
          name: 'characteristics.propertyType',
          validation: [Validation.required],
          icons: true,
          cardLayout: true,
          cardSmall: true,
          svgSupport: true,
          isHorizontal: true,
          pdClass: 'pt-3 pb-5',
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
              label: 'Building land',
              img: "<svg width='100%' height='100%' preserveAspectRatio='xMidYMid meet' class='svg-content' viewBox='0 0 203 78' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0)'><path class='willtrans whiteHover' fill-rule='evenodd' clip-rule='evenodd' d='M182.8 25.9v-.7c0-7.6-6.1-13.7-13.7-13.7-.5 0-1 0-1.5.1-3.5.4-6.9-1.2-9.1-4C154.9 3 149.4 0 143.1 0c-6.3 0-12 3-15.5 7.7-2 2.7-5.3 4.2-8.7 3.8-.6-.1-1.1-.1-1.7-.1-7.6 0-13.7 6.1-13.7 13.7v.7h79.3v.1z' fill='#D8EDF0'/><path  d='M104.7 77.2c0-13.9-11.3-25.2-25.2-25.2-13.9 0-25.1 11.3-25.1 25.2h50.3z' fill='#84DADE'/><path d='M123 77.2c-1.9-7.8-8.9-13.6-17.3-13.6s-15.4 5.8-17.3 13.6H123zM61.7 77.2c-1.9-7.8-8.9-13.6-17.3-13.6S29 69.4 27.1 77.2h34.6z' fill='#84DADE'/><path d='M161 77.2c-1.9-7.8-8.9-13.6-17.3-13.6s-15.4 5.8-17.3 13.6H161z' fill='#1ECAD3'/><path fill-rule='evenodd' clip-rule='evenodd' d='M83.5 77.2H41.8l20.8-64.3 20.9 64.3z' fill='#004A98'/><path class='willtrans whiteHover' fill-rule='evenodd' clip-rule='evenodd' d='M101.1 37.1c-3.3-4.7-8.7-7.8-14.9-7.8-1.3 0-2.6.1-3.8.4-4.6 1-9.4.4-13.5-1.9-5.1-2.8-11-4.5-17.2-4.5-11.4 0-21.5 5.4-28 13.8h77.4z' fill='#D8EDF0'/><path d='M143.1 60.8c12.095 0 21.9-9.805 21.9-21.9 0-12.095-9.805-21.9-21.9-21.9-12.095 0-21.9 9.805-21.9 21.9 0 12.095 9.805 21.9 21.9 21.9z' fill='#84DADE'/><path d='M143.7 28v49.1M136 33.8l7.7 7.7M143.5 51.1l11.7-11.7' stroke='#323E48' stroke-width='2' stroke-miterlimit='10' stroke-linejoin='round'/><path d='M112.5 63.9C99 63.9 89.8 50.2 95 37.8l11.3-27.6c2.7-6.7 12.3-6.4 14.6.5l9.6 28.3c4.1 12.1-5.1 24.9-18 24.9z' fill='#1ECAD3'/><path d='M112.5 26.8v50.6M112.8 45.1l8.7-8.7M112.2 53.4l-8.6-8.7' stroke='#323E48' stroke-width='2' stroke-miterlimit='10' stroke-linejoin='round'/><path d='M0 77.1h202.3' stroke='#323E48' stroke-miterlimit='10' stroke-linejoin='round'/></g><defs><clipPath id='clip0'><path fill='#fff' d='M0 0h202.3v77.6H0z'/></clipPath></defs></svg>",
              color: 'blue',
            },
          ],
        },
      ],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: translateTo(lang, 'How big should it be?'),
      history: 'tipology',
      vCentered: true,
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 m-a pl-2 pr-0 px-sm-5 py-5',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputMultiRange,
          classNameInput: 'mt-1',
          label: 'Number of rooms',
          name: 'characteristics.bedrooms',
          validation: [Validation.required],
          step: 1,
          addPlusOnLast: true,
          minLengthNum: 0,
          maxLengthNum: 9,
        },
        {
          component: BrixelInputMultiRange,
          className: 'mt-2',
          classNameInput: 'pl-5',
          label: 'Living Space in m2',
          name: 'characteristics.livingArea',
          validation: [Validation.required],
          step: 10,
          addPlusOnLast: true,
          minLengthNum: 0,
          maxLengthNum: 300,
        },
      ],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: 'What extras are a must for you?',
      subtitle: 'You can choose more than one.',
      history: 'extraFeature',
      vCentered: true,
      className: 'fieldHolder bgWhite brdRadius max-w-fix-800 m-a px-2 px-sm-5 py-5',
      footerWidth: 'max-w-fix-800',
      inputs: [
        {
          className: 'extraFeature',
          component: BrixelExtraFeature,
          name: 'characteristics.extraFeatures',
          extraFeatureCustomList: factsOptions.extraFeatureShort,
        },
      ],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: translateTo(lang, 'Where would your dream home be located?'),
      subtitle: translateTo(lang, 'You can add multiple addresses.'),
      history: 'locationInput',
      cardType: 'locationInput',
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 w-perc-100 m-a px-2 px-sm-5 py-5 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          className: 'pos-r zIndex6 compact',
          classBoxWrapper: 'searchMapCountry mr-2',
          component: BrixelSelect,
          label: 'Country',
          labelType: 'onlyFlag',
          name: 'location.countryCode',
          options: countryList,
          validation: [Validation.required],
        },
        {
          component: MapsCities,
          classBoxWrapper: 'w-perc-100 flex-1 searchMapFields',
          showMap: false,
          name: 'locations[0].latitude',
          classNameBox: 'max-w-perc-100',
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
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 m-a',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-600 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          className: '',
          label: `Max. selling price in ${get(formValue, 'finance.currency', 'CHF')}`,
          placeholder: get(formValue, 'finance.currency', 'CHF') === 'CHF' ? '800’000' : '800.000',
          name: 'finance.price.totalMax',
          formatType: 'price',
          unit: get(formValue, 'finance.currency', 'CHF'),
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.'),
    },
    {
      title: translateTo(lang, 'What is your current living situation?'),
      history: 'livingSituation',
      cardType: 'LivingSituation',
      className: 'max-w-fix-480 m-a',
      footerWidth: 'max-w-fix-480',
      inputs: [
        {
          component: BrixelRadioButton,
          pdClass: 'py-2 py-lg-3 px-1',
          icons: true,
          label: '',
          name: 'profile.livingSituation',
          options: factsOptions.buyerLivingSituation,
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
      signupTitle: translateTo(lang, 'Create your profile to save your progress.'),
      loginTitle: translateTo(lang, 'Login to your profile to save your progress.'),
      cardType: 'createProfile',
      inputs: [{
        component: LoginSignup,
        name: 'profileUaer',
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
