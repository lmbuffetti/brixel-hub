/* eslint-disable max-len */
import {
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelRadioButton,
  Validation,
} from '@brixel-io/brixel-components/dist/form';
import baseByData from '@brixel-io/brixel-components/dist/configuration/Settings';
import {BrixelAutocomplete} from '@brixel-io/brixel-components/dist/map';
import get from 'lodash/get';
import LoginSignup from '../../components/LoginSignup';
import MapsWithModalManual from '../../components/Map/MapsWithModalManual';
import {configureStore} from '../../store';
// import ResumeCard from '../components/ResumeCard';
import translateTo from '../../utils/translation';
import {svgIcons} from '../Utilities/svgIcons';
import {QuestionsListType} from '@brixel-io/brixel-components/dist/@types/Model';
import BrixelBoutiqueThankYou from '../../Pages/PackageFlow/BrixelBoutiqueThankYou';

// QUESTION LISTS
// eslint-disable-next-line default-param-last
export const QuestionsList: (lang: string, country: string, changeValue: (field: string, val: any) => void) => QuestionsListType[] = (lang, country, changeValue) => {
  // VALIDATION OF FIELDS
  const maxLengthNum = (val, name) => (value) => {
    let error: string | null = null;
    if (value && value >= val) {
      error = translateTo(name === 'year' ? `Year can't be after ${val}` : `The ${name} have to be less then ${val}`, lang);
    }
    return error;
  };

  const minLengthNum = (val, name) => (value) => {
    let error: string | null = null;
    if (value && value <= val) {
      error = translateTo(name === 'year' ? `Too old! year can't be before ${val}` : `The ${name} have to be more then ${val}`, lang);
    }
    return error;
  };

  const minLengthNumYear = minLengthNum(1500, 'year');
  const maxLengthNumRooms = maxLengthNum(31, 'rooms');
  const maxLengthNumLivSpace = maxLengthNum(9999, 'living space');
  const maxLengthNumYear = maxLengthNum(2031, 'year');

  let propertyType;

  if (configureStore) {
    propertyType = get(configureStore.getState(), 'brixelForm.GetStarted.values.properties.propertyType', '');
  }
  let livingAreaTitle = translateTo('What is the living space size?', lang);
  if (propertyType === 'Commercial') livingAreaTitle = translateTo('What is the floor size?', lang);

  const propertyTypeOptions = [
    {
      label: translateTo('Apartment', lang),
      value: 'Apartment',
      img: svgIcons.apartmentGreen,
      color: 'green',
    },
    {
      label: translateTo('House', lang),
      value: 'House',
      img: svgIcons.houseGreen,
      color: 'green',
    },
  ];

  const question: QuestionsListType[] = [
    {
      background: 'bgGreen100',
      hideProgress: true,
      hideFooter: true,
      cardType: 'loadComponent',
      component: BrixelBoutiqueThankYou,
      history: 'success',
      vCentered: true,
      toSave: true,
    },
    /* subtitle: translateTo('Choose between apartment, house, building land and commercial.'), */
    {
      title: translateTo('What do you want to sell?', lang),
      history: 'propertyType',
      footerWidth: 'ml-a mr-a max-w-fix-576',
      hideBackArrow: true,
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        classNameBox: 'ml-a mr-a max-w-fix-576',
        ReduxFieldClass: '',
        label: translateTo('', lang),
        name: 'properties.propertyType',
        validation: [Validation.required],
        icons: true,
        cardLayout: true,
        cardSmall: true,
        svgSupport: true,
        svgWidth: 'max-w-fix-120 max-w-fix-sm-200',
        pdClass: 'py-sm-5',
        isHorizontal: true,
        options: propertyTypeOptions,
      }],
      successMessage: translateTo('Ok. Got it.', lang),
    },
    {
      title: translateTo('How many rooms?', lang),
      history: 'allRooms',
      cardType: 'allRooms',
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          component: BrixelInputStepNumber,
          classNameBox: 'max-w-fix-384 w-perc-100 fieldHolder bgWhite brdRadius py-6 px-5 m-a',
          label: translateTo('Number of rooms', lang),
          name: 'properties.typology.bedrooms',
          validation: [maxLengthNumRooms, Validation.required],
          step: 0.5,
          placeholder: '3',
          formatType:  undefined,
          min: 0,
          max: 30,
          fluid: true,
          startFrom: 3,
          large: true,
          tooltip: {
            label: translateTo('What is this?', lang),
            description: translateTo('Enter the number of rooms that have a minimum surface of 8 m². Kitchen and bathrooms are not counted as a proper room.', lang),
          },
        },
      ],
      successMessage: translateTo('This is a nice number.', lang),
    },
    {
      title: livingAreaTitle,
      history: 'livingSpace',
      cardType: 'livingSpace',
      footerWidth: 'max-w-fix-400',
      showSendButton: false,
      inputs: [
        {
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-400 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          className: '',
          label: translateTo('Net living space', lang),
          name: 'properties.typology.livingArea.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          placeholder: '117',
          maxLengthNum: 9999,
          large: true,
          tooltip: {
            label: translateTo('What is this?', lang),
            description: translateTo('The net living space is the part of the usable surface, which is specified for the primary use of the building. Included are entrance and courtyard, mobile walls, interior stairs, and fireplace. Excluded are external walls, internal walls, chimney, balcony, patio, attic, basement, rooms with room height under 1.2 m, and storerooms.', lang),
          },
        },
      ],
      successMessage: translateTo('Great living space.', lang),
    },
    {
      title: translateTo('What is the construction year?', lang),
      history: 'constructionYear',
      cardType: 'constructionYear',
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          component: BrixelInputText,
          label: translateTo('Construction year', lang),
          name: 'properties.building.built',
          type: 'number',
          classNameBox: 'brdRadius max-w-fix-384 w-perc-100 px-2 px-sm-5 py-5 brdRadius fieldHolder bgWhite m-a',
          placeholder: translateTo('e.g. 1990', lang),
          validation: [Validation.positiveNumber, maxLengthNumYear, minLengthNumYear, Validation.required],
          maxLengthNum: 9999,
          minLengthNum: 999,
          large: true,
        },
      ],
      successMessage: translateTo('A good year for real estate.', lang),
    },
  ];
  if (propertyType) {
    question.push(
      {
        title: translateTo('What is the location?', lang),
        history: 'locationInput',
        cardType: 'locationInput',
        footerWidth: 'max-w-fix-600',
        inputs: [
          {
            component: BrixelAutocomplete,
            showMap: false,
            name: 'location.searchAddress',
            type: 'Map',
            classNameBox: 'brdRadius max-w-fix-600 w-perc-100 px-2 px-sm-5 py-5 brdRadius fieldHolder bgWhite m-a',
            classBoxWrapper: 'mt-0 searchMapFields',
            onSelectAddress: (val) => changeValue('location', val),
            validation: [Validation.required],
            country: country,
            mapOptions: {
              baseByData: baseByData,
              country: country,
              lang: lang,
              input: {
                onSelectAddress: (val) => changeValue('location', val),
              },
            },
          },
        ],
      },
      {
        title: translateTo('Is this your correct location?', lang),
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
              lang: lang,
            },
            validation: [Validation.required],
          },
        ],
      },
    );
    question.push(
      {
        condition: [{
          name: 'owner',
          value: null,
        }],
        //background: 'bgCardGreen',
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
      },
      // GENERAL SAVING FUNCTION FOR EVERYONE
      {
        background: 'bgGreen100',
        hideProgress: true,
        hideFooter: true,
        cardType: 'loadComponent',
        component: BrixelBoutiqueThankYou,
        history: 'success',
        vCentered: true,
        toSave: true,
      },
    );
  }
  return question;
};
