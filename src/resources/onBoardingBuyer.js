/* eslint-disable max-len */
import { FactsOptions } from '@brixel/brixel-components';
import {
  BrixelRadioButton,
  BrixelCheckbox,
  BrixelExtraFeature,
  BrixelInputMultiRange,
  BrixelInputText,
  BrixelSelect,
  Validation,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import MapsCities from '../components/Map/MapsCities';
import LoginSignup from '../components/LoginSignup';
import { translateTo } from '../utils/translation';
import { configureStore } from '../store';
import { svgIcons } from './svgIcons';

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
export const QuestionsList = (lang, type) => {
  let countryList = [];
  let formValue = {};
  if (configureStore) {
    countryList = get(configureStore.getState(), 'common.country', []);
    formValue = get(configureStore.getState(), 'brixelForm.GetStarted.values', []);
    // country = get(configureStore.getState(), 'brixelForm.GetStarted.values.location.countryCode', 'CH');
  }

  return [
    {
      title: type === 'searchProfile' ? 'Property Type' : 'What kind of property would you like to buy?',
      subtitle: translateTo(lang, 'Choose between apartment, house and building land.'),
      history: 'propertyType',
      footerWidth: 'max-w-fix-880',
      inputs: [
        {
          component: BrixelCheckbox,
          className: 'radioBtnImg',
          ReduxFieldClass: '',
          classNameBox: 'max-w-fix-880 ml-a mr-a',
          label: '',
          name: 'characteristics.propertyType',
          validation: [Validation.required],
          icons: true,
          cardLayout: true,
          cardSmall: true,
          svgSupport: true,
          isHorizontal: true,
          svgWidth: 'max-w-fix-120 max-w-fix-sm-200',
          pdClass: type === 'searchProfile' ? 'pt-sm-2 pb-sm-3' : 'py-sm-5',
          options: [
            {
              label: 'Apartment',
              value: 'Apartment',
              img: svgIcons.apartment,
              color: 'blue',
            },
            {
              label: 'House',
              value: 'House',
              img: svgIcons.house,
              color: 'blue',
            },
            {
              label: 'Building land',
              value: 'Building land',
              img: svgIcons.land,
              color: 'blue',
            },
          ],
        },
      ],
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: type === 'searchProfile' ? 'Size' : 'How big should it be?',
      history: 'tipology',
      vCentered: true,
      classWrap: 'inputRangeWrap',
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
          className: type === 'searchProfile' ? '' : 'mt-2',
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
      hideSearchProfile: true,
      successMessage: translateTo(lang, 'Ok. Got it.'),
    },
    {
      title: type === 'searchProfile' ? 'Location' : 'Where would your dream home be located?',
      subtitle: translateTo(lang, 'You can add multiple addresses.'),
      history: 'locationInput',
      cardType: 'locationInput',
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 w-perc-100 m-a px-2 px-sm-5 py-5 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      classQuest: 'dis-f',
      inputs: [
        {
          className: 'pos-r zIndex6 compact',
          classBoxWrapper: 'searchMapCountry mr-2',
          component: BrixelSelect,
          blockScroll: type === 'searchProfile',
          label: 'Country',
          labelType: 'onlyFlag',
          name: type === 'searchProfile' ? 'location.countryCode' : 'location.countryCode',
          options: countryList,
          validation: [Validation.required],
          large: true,
        },
        {
          component: MapsCities,
          classBoxWrapper: 'w-perc-100 flex-1 searchMapFields',
          showMap: false,
          blockScroll: type === 'searchProfile',
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
      title: type === 'searchProfile' ? `Max selling price in ${get(formValue, 'finance.currency', 'CHF')}` : 'What is your budget?',
      history: 'price',
      cardType: 'Price',
      className: `fieldHolder bgWhite brdRadius ${type === 'searchProfile' ? 'max-w-fix-320' : 'max-w-fix-600 m-a'}`,
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          currency: type === 'searchProfile' ? get(formValue, 'finance.currency', 'CHF') : null,
          component: BrixelInputText,
          classNameBox: `brdRadius fieldHolder bgWhite ${type === 'searchProfile' ? 'max-w-fix-320' : 'max-w-fix-600 px-2 px-sm-5 py-5 m-a'}`,
          className: '',
          label: type === 'searchProfile' ? null : `Max. selling price in ${get(formValue, 'finance.currency', 'CHF')}`,
          placeholder: get(formValue, 'finance.currency', 'CHF') === 'CHF' ? '800’000' : '800.000',
          name: 'finance.price.totalMax',
          formatType: 'price',
          unit: get(formValue, 'finance.currency', 'CHF'),
          large: true,
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
          pdClass: 'py-2 py-lg-3 px-2',
          icons: true,
          label: '',
          name: 'profile.livingSituation',
          options: factsOptions.buyerLivingSituation,
        },
      ],
      hideSearchProfile: true,
      successMessage: translateTo(lang, 'This is a nice number.'),
    },
    {
      conditions: [{
        name: 'owner',
        value: null,
      }],
      background: 'bgCardGreen',
      history: 'createProfile',
      component: LoginSignup,
      signupTitle: translateTo(lang, 'Create your profile to save your progress.'),
      loginTitle: translateTo(lang, 'Login to your profile to save your progress.'),
      cardType: 'createProfile',
      inputs: [{
        skipPhone: true,
        component: LoginSignup,
        name: 'register.name',
        validation: [Validation.required],
      }],
      hideSearchProfile: true,
    },
    {
      history: 'savingData',
      cardType: 'createProfile',
      toSave: true,
      hideSearchProfile: true,
    },
  ];
};
