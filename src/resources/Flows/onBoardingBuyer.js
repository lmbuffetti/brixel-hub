/* eslint-disable max-len */
import { FactsOptions, translateTo } from '@brixel/brixel-components';
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
import MapsCities from '../../components/Map/MapsCities';
import LoginSignup from '../../components/LoginSignup';
import { configureStore } from '../../store';
import { svgIcons } from '../Utilities/svgIcons';

const { factsOptions } = FactsOptions;

// QUESTION LISTS
export const QuestionsList = (lang, type) => {
  let countryList = [];
  let formValue = {};
  let company = null;

  if (configureStore) {
    countryList = get(configureStore.getState(), 'common.country', []);
    formValue = get(configureStore.getState(), 'brixelForm.GetStarted.values', []);
    company = get(configureStore.getState(), 'brixelForm.GetStarted.values.company', '');
    // country = get(configureStore.getState(), 'brixelForm.GetStarted.values.location.countryCode', 'CH');
  }
  const newExtraFeature = factsOptions.extraFeatureShort.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));

  const buyerLivingSituation = factsOptions.buyerLivingSituation.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));

  const question = [
    {
      title: translateTo(type === 'searchProfile' ? 'Property Type' : 'What kind of property would you like to buy?', lang),
      subtitle: translateTo('Choose between apartment, house and building land.', lang),
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
              label: translateTo('Apartment', lang),
              value: 'Apartment',
              img: svgIcons.apartment,
              color: 'blue',
            },
            {
              label: translateTo('House', lang),
              value: 'House',
              img: svgIcons.house,
              color: 'blue',
            },
            {
              label: translateTo('Building land', lang),
              value: 'Building land',
              img: svgIcons.land,
              color: 'blue',
            },
          ],
        },
      ],
      successMessage: translateTo('Ok. Got it.'),
    },
    {
      title: translateTo(type === 'searchProfile' ? 'Size' : 'How big should it be?', lang),
      history: 'tipology',
      vCentered: true,
      classWrap: 'inputRangeWrap',
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 m-a pl-2 pr-0 px-sm-5 py-5',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputMultiRange,
          classNameInput: 'mt-1',
          label: translateTo('Number of rooms', lang),
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
          label: translateTo('Living Space in m2', lang),
          name: 'characteristics.livingArea',
          validation: [Validation.required],
          step: 10,
          addPlusOnLast: true,
          minLengthNum: 0,
          maxLengthNum: 300,
        },
      ],
      successMessage: translateTo('Ok. Got it.', lang),
    },
    {
      title: translateTo('What extras are a must for you?', lang),
      subtitle: translateTo('You can choose more than one.', lang),
      history: 'extraFeature',
      vCentered: true,
      className: 'fieldHolder bgWhite brdRadius max-w-fix-800 m-a px-2 px-sm-5 py-5',
      footerWidth: 'max-w-fix-800',
      inputs: [
        {
          className: 'extraFeature',
          component: BrixelExtraFeature,
          name: 'characteristics.extraFeatures',
          extraFeatureCustomList: newExtraFeature,
        },
      ],
      hideSearchProfile: true,
      successMessage: translateTo('Ok. Got it.', lang),
    },
    {
      title: translateTo(type === 'searchProfile' ? 'Location' : 'Where would your dream home be located?', lang),
      subtitle: translateTo('You can add multiple addresses.', lang),
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
          label: translateTo('Country', lang),
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
      successMessage: translateTo('That is an interesting location.', lang),
    },
    {
      title: translateTo(type === 'searchProfile' ? `Max selling price in ${get(formValue, 'finance.currency', 'CHF')}` : 'What is your budget?', lang),
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
      successMessage: translateTo('This is a nice number.', lang),
    },
    {
      title: translateTo('What is your current living situation?', lang),
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
          options: buyerLivingSituation,
        },
      ],
      hideSearchProfile: true,
      successMessage: translateTo('This is a nice number.', lang),
    },
    {
      conditions: [{
        name: 'owner',
        value: null,
      }],
      background: 'bgCardGreen',
      history: 'createProfile',
      component: LoginSignup,
      signupTitle: translateTo('Create your profile to save your progress.', lang),
      loginTitle: translateTo('Login to your profile to save your progress.', lang),
      cardType: 'createProfile',
      inputs: [{
        skipPhone: true,
        component: LoginSignup,
        name: 'register.name',
        validation: [Validation.required],
      }],
      hideSearchProfile: true,
    },
  ];
  if ((company !== 'baloise') && (company !== 'ubs')) {
    question.push(
      {
        hideSearchProfile: true,
        history: 'savingData',
        cardType: 'createProfile',
        toSave: true,
      },
    )
  }
  question.push(
    {
      conditions: [{
        name: 'company',
        value: 'ubs',
      }],
      title: translateTo('Activate your UBS advantages now.', lang),
      history: 'ubsPolicy',
      cardType: 'ubsPolicy',
      footerWidth: 'max-w-fix-912',
      bulletPoints: {
        title: translateTo('What are my advantages?', lang),
        description: [
          translateTo('You get CHF 2000 discount', lang),
          translateTo('You pay only if the sale is successful', lang),
          translateTo('Your selling price is checked', lang),
        ]
      },
      text: [{
        title: translateTo('Transmission of data to UBS', lang),
        description: translateTo('I authorize Brixel to transmit my data to UBS AG in order to benefit from the joint advantage offer...', lang),
      },]
    }
  );
  question.push(
    {
      conditions: [{
        name: 'company',
        value: 'baloise',
      }],
      title: translateTo('Benefit from the consulting services of our partner Baloise.', lang),
      history: 'baloisePolicy',
      cardType: 'baloisePolicy',
      footerWidth: 'max-w-fix-752',
      text: [{
        title: translateTo('Transmission of data to Baloise Insurance.', lang),
        description: translateTo('I hereby agree that my data (Surname, first name, phone number, e-mail) is transmitted to Baloise Insurance Ltd. and Baloise Bank SoBa Ltd. so that I can receive newsletters or telephone contact regarding home financing, pension provision and assets. Furthermore, in order to check whether I am already a customer of Baloise Insurance Ltd. and/or Baloise Bank SoBa Ltd., I authorize Baloise Insurance Ltd. and Baloise Bank SoBa Ltd. to compare with my relevant data held by Baloise Insurance Ltd. and Baloise Bank SoBa Ltd. You can revoke this consent at any time in the future. If you no longer wish to receive the newsletter from Baloise Insurance Ltd and Baloise Bank SoBa Ltd, you can cancel this by clicking on the link provided in the respective newsletter. The revocation of consent does not affect the legality of the data processing carried out on the basis of the consent until revocation.', lang),
      },]
    },
  )
  return question;
};
