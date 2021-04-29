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

import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
import buildingLand from '../images/BrxielComingTown/building-land.svg';

import aptIcon from '../images/getstarted/aptIcon.svg';
import houIcon from '../images/getstarted/houIcon.svg';
import lanIcon from '../images/getstarted/lanIcon.svg';

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
      bgImg: homesSvg,
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
          isHorizontal: true,
          pdClass: 'pt-3 pb-5',
          options: [
            {
              label: translateTo(lang, 'Apartment'),
              value: 'Apartment',
              img: aptIcon,
              color: 'blue',
            },
            {
              label: translateTo(lang, 'House'),
              value: 'House',
              img: houIcon,
              color: 'blue',
            },
            {
              label: 'Building land',
              value: 'Building land',
              img: lanIcon,
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
      bgImg: roomsSvg,
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
      bgImg: roomsSvg,
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
      bgImg: locationSvg,
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 w-perc-100 m-a px-2 px-sm-5 py-5 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          className: 'pos-r zIndex6 compact',
          classBoxWrapper: 'w-fix-80 searchMapCountry',
          component: BrixelSelect,
          label: 'Country',
          labelType: 'onlyFlag',
          name: 'location.countryCode',
          options: countryList,
          validation: [Validation.required],
        },
        {
          component: MapsCities,
          classBoxWrapper: 'w-perc-100 flex-1 pl-2 searchMapFields',
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
      bgImg: congratsSvg,
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
      title: translateTo(lang, 'What is your family situation?'),
      history: 'familySituation',
      cardType: 'FamilySituation',
      bgImg: congratsSvg,
      className: 'max-w-fix-480 m-a',
      footerWidth: 'max-w-fix-480',
      inputs: [
        {
          component: BrixelRadioButton,
          classNameBox: 'familySituation',
          pdClass: 'py-2 py-lg-3 px-1',
          icons: true,
          label: '',
          className: 'test3',
          name: 'profile.familySituation',
          options: factsOptions.buyerFamilySituation,
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.'),
    },
    {
      title: translateTo(lang, 'How is your knowledge about buying a property?'),
      history: 'knowledge',
      cardType: 'Knowledge',
      className: 'max-w-fix-480 m-a',
      footerWidth: 'max-w-fix-480',
      bgImg: congratsSvg,
      inputs: [
        {
          component: BrixelRadioButton,
          pdClass: 'py-2 py-lg-3 px-1',
          icons: true,
          label: '',
          name: 'profile.knowledge',
          options: factsOptions.buyerKnowledge,
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.'),
    },
    {
      title: translateTo(lang, 'What is your current living situation?'),
      history: 'livingSituation',
      cardType: 'LivingSituation',
      bgImg: congratsSvg,
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
      bgImg: congratsSvg,
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
