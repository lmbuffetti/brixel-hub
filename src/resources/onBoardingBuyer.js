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
      className: 'max-w-fix-880 ml-a mr-a',
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
              label: 'Building land',
              img: "<svg preserveAspectRatio='xMidYMid meet' class='svg-content' viewBox='0 0 200 110' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0)'><path class='willtrans whiteHover' fill-rule='evenodd' clip-rule='evenodd' d='M180.722 58.605v-.691a13.502 13.502 0 00-13.545-13.545c-.494 0-.988 0-1.483.1-3.46.395-6.821-1.187-8.996-3.955-3.559-4.548-8.997-7.514-15.225-7.514s-11.864 2.966-15.324 7.612c-1.977 2.67-5.239 4.153-8.601 3.757-.593-.099-1.087-.099-1.681-.099a13.502 13.502 0 00-13.544 13.545v.692h78.399v.099z' fill='#D8EDF0'/><path d='M103.51 109.322c0-13.742-11.172-24.913-24.914-24.913S53.782 95.58 53.782 109.322h49.728z' fill='#84DADE'/><path d='M121.602 109.322c-1.879-7.711-8.799-13.445-17.104-13.445-8.304 0-15.225 5.734-17.103 13.445h34.207zM60.999 109.322c-1.879-7.711-8.8-13.445-17.104-13.445-8.304 0-15.225 5.734-17.103 13.445h34.207z' fill='#84DADE'/><path d='M159.17 109.322c-1.879-7.711-8.799-13.445-17.104-13.445-8.304 0-15.225 5.734-17.103 13.445h34.207z' fill='#1ECAD3'/><path fill-rule='evenodd' clip-rule='evenodd' d='M82.55 109.322H41.326l20.563-63.569 20.663 63.569z' fill='#004A98'/><path class='willtrans whiteHover' fill-rule='evenodd' clip-rule='evenodd' d='M99.95 69.678c-3.262-4.646-8.6-7.711-14.73-7.711-1.285 0-2.57.099-3.757.395-4.547.989-9.293.396-13.346-1.878-5.042-2.768-10.875-4.449-17.005-4.449-11.27 0-21.255 5.339-27.681 13.643h76.52z' fill='#D8EDF0'/><path d='M141.473 93.109c11.958 0 21.651-9.694 21.651-21.651 0-11.958-9.693-21.651-21.651-21.651-11.957 0-21.651 9.693-21.651 21.65 0 11.958 9.694 21.652 21.651 21.652z' fill='#84DADE'/><path d='M142.066 60.682v48.541M134.454 66.415l7.612 7.613M141.869 83.52l11.567-11.568' stroke='#323E48' stroke-width='2' stroke-miterlimit='10' stroke-linejoin='round'/><path d='M111.221 96.173c-13.347 0-22.442-13.544-17.301-25.803l11.171-27.286c2.67-6.624 12.161-6.327 14.434.494l9.491 27.978c4.054 11.963-5.042 24.617-17.795 24.617z' fill='#1ECAD3'/><path d='M111.221 59.495v50.025M111.518 77.587l8.601-8.6M110.925 85.793l-8.503-8.601' stroke='#323E48' stroke-width='2' stroke-miterlimit='10' stroke-linejoin='round'/><path d='M1.6 109.5h196.9' fill='none' stroke='#323e48' stroke-width='1' stroke-linejoin='round' /></g><defs><clipPath id='clip0'><path fill='#fff' transform='translate(0 33)' d='M0 0h200v76.718H0z'/></clipPath></defs></svg>",
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
          pdClass: 'py-2 py-lg-3 px-2',
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
