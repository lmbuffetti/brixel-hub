/* eslint-disable max-len */
import { FactsOptions } from '@brixel/brixel-components';
import {
  BrixelCheckbox,
  BrixelCheckboxSingle,
  BrixelExtraFeature,
  BrixelInputMultiRange,
  BrixelInputText,
  BrixelRadioButton,
  BrixelSelect,
  Validation,
} from '@brixel/brixel-components/dist/form';
import { BrixelAutocomplete } from '@brixel/brixel-components/dist/map';
import get from 'lodash/get';
import LoginSignup from '../../components/LoginSignup';
import { configureStore } from '../../store';
import translateTo from '../../utils/translation';
import { svgIcons } from '../Utilities/svgIcons';

const { factsOptions } = FactsOptions;

// QUESTION LISTS
export const QuestionsList = (lang, type, changeField, formName = 'GetStarted') => {
  let countryList = [];
  let formValue = {};
  // let company = null;
  if (configureStore) {
    countryList = get(configureStore.getState(), 'common.country', []);
    formValue = get(configureStore.getState(), `brixelForm[${formName}].values`, []);
    // company = get(configureStore.getState(), 'brixelForm.GetStarted.values.company', '');
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
  const multiCities = [...get(formValue, 'locations', [])];
  const question = [
    {
      title: translateTo(type === 'searchProfile' ? 'Property Type' : 'What kind of property would you like to buy?', lang),
      subtitle: translateTo('Choose between apartment, house and building land.', lang),
      history: 'propertyType',
      footerWidth: 'max-w-fix-880',
      classWrap: type === 'searchProfile' ? 'brdSmallBottom brdLight200 pb-2 pb-md-4' : '',
      inputs: [
        {
          component: BrixelCheckbox,
          className: 'radioBtnImg',
          ReduxFieldClass: '',
          classNameBox: type === 'searchProfile' ? 'max-w-fix-880 ml-md-1-neg mr-a' : 'max-w-fix-880 ml-a mr-a',
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
      successMessage: translateTo('Ok. Got it.', lang),
    },
    {
      title: translateTo(type === 'searchProfile' ? 'How big should it be?' : 'How big should it be?', lang),
      history: 'tipology',
      vCentered: true,
      classWrap: type === 'searchProfile' ? 'brdSmallBottom brdLight200 pb-2 pb-md-4 inputRangeWrap' : 'inputRangeWrap',
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 m-a pl-2 pr-0 px-sm-5 py-5',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelInputMultiRange,
          className: 'max-w-fix-520',
          classNameInput: 'mt-1',
          label: translateTo('Number of rooms', lang),
          name: 'characteristics.bedrooms',
          validation: [Validation.required],
          step: 1,
          addPlusOnLast: true,
          minLengthNum: 0,
          maxLengthNum: 9,
          showSingleValCheck: true,
        },
        {
          component: BrixelInputMultiRange,
          className: type === 'searchProfile' ? 'max-w-fix-520' : 'mt-2',
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
      classWrap: type === 'searchProfile' ? 'brdSmallBottom brdLight200 pb-2 pb-md-4' : '',
      inputs: [
        {
          className: type === 'searchProfile' ? 'extraFeature' : 'extraFeature',
          component: BrixelExtraFeature,
          name: 'characteristics.extraFeatures',
          extraFeatureCustomList: newExtraFeature,
        },
      ],
      successMessage: translateTo('Ok. Got it.', lang),
    },
    {
      title: translateTo(type === 'searchProfile' ? 'Location' : 'Where would your dream home be located?', lang),
      subtitle: translateTo('You can add multiple addresses.', lang),
      history: 'locationInput',
      cardType: 'locationInput',
      classWrap: type === 'searchProfile' ? 'brdSmallBottom brdLight200 pb-4' : '',
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 w-perc-100 m-a px-2 px-sm-5 py-5 dis-f flex-wrap',
      footerWidth: 'max-w-fix-600',
      classQuest: 'dis-fl-col dis-fl-row-sm',
      inputs: [
        {
          className: 'pos-r zIndex6 compact',
          classBoxWrapper: 'searchMapCountry mr-2 mb-2 mb-sm-0',
          component: BrixelSelect,
          blockScroll: type === 'searchProfile',
          label: translateTo('Country', lang),
          labelType: 'onlyFlag',
          name: 'location.countryCode',
          options: countryList,
          large: true,
        },
        {
          component: BrixelAutocomplete,
          classBoxWrapper: 'w-perc-100 flex-1 searchMapFields',
          className: type === 'searchProfile' ? 'max-w-fix-400' : '',
          showMap: false,
          blockScroll: type === 'searchProfile',
          label: get(formValue, 'location.countryCode', 'ch'),
          // name: 'location.searchAddress',
          name: 'locations',
          classNameBox: 'max-w-perc-100',
          searchType: 'cities',
          type: 'Map',
          lang: lang,
          country: get(formValue, 'location.countryCode', 'ch'),
          multiCities: multiCities,
          deleteMultiCity: (id) => {
            const location = multiCities;
            location.splice(id, 1);
            changeField('locations', location);
          },
          onSelectAddress: (val) => {
            const location = multiCities;
            location.push(val);
            changeField('location.searchAddress', '');
            changeField('locations', location);
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
      className: `fieldHolder bgWhite brdRadius ${type === 'searchProfile' ? 'max-w-fix-344' : 'max-w-fix-600 m-a'}`,
      classWrap: type === 'searchProfile' ? 'brdSmallBottom brdLight200 pb-4' : '',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          currency: get(formValue, 'location.countryCode', '').toLowerCase() === 'ch' ? 'CHF' : 'EUR',
          component: BrixelInputText,
          classNameBox: `brdRadius fieldHolder bgWhite ${type === 'searchProfile' ? 'max-w-fix-344' : 'max-w-fix-600 px-2 px-sm-5 py-5 m-a'}`,
          className: '',
          label: type === 'searchProfile' ? null : translateTo(`Max. selling price in ${get(formValue, 'location.countryCode', '').toLowerCase() === 'ch' ? 'CHF' : 'EUR'}`, lang),
          placeholder: get(formValue, 'finance.currency', 'CHF') === 'CHF' ? '800’000' : '800.000',
          name: 'finance.price.totalMax',
          formatType: 'price',
          unit: get(formValue, 'location.countryCode', '').toLowerCase() === 'ch' ? 'CHF' : 'EUR',
          large: true,
        },
      ],
    },
    {
      history: 'name',
      cardType: 'name',
      className: 'max-w-fix-480 m-a',
      footerWidth: 'max-w-fix-480',
      title: translateTo('Let’s give your new search profile a name', lang),
      inputs: [
        {
          component: BrixelInputText,
          pdClass: 'py-2 py-lg-3 px-2',
          classNameBox: `brdRadius fieldHolder bgWhite ${type === 'searchProfile' ? 'max-w-fix-344' : 'max-w-fix-600 px-2 px-sm-5 py-5 m-a'}`,
          placeholder: 'Search Profile Name',
          name: 'name',
          large: true,
        },
        {
          component: BrixelCheckboxSingle,
          name: 'isDefault',
          pdClass: type === 'searchProfile' ? 'pt-sm-2 pb-sm-3' : 'py-sm-5',
          classBoxWrapper: 'mt-2',
          options: {
            label: translateTo('Set as default search profile', lang),
            value: true,
          }
        },
      ],
      hideSearchProfileFlow: true,
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
      condition: [{
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
    {
      hideSearchProfile: true,
      history: 'savingData',
      cardType: 'createProfile',
      toSave: true,
    },
  ];
  return question;
};
