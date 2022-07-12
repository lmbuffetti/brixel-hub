/* eslint-disable max-len */
import {
  BrixelRadioButton,
  BrixelInputStepNumber,
  BrixelInputText,
  Validation,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import { factsOptions } from '@brixel/brixel-components/dist/constants/Facts';
import MapsWithModalManual from '../../components/Map/MapsWithModalManual';
import LoginSignup from '../../components/LoginSignup';
// import ResumeCard from '../components/ResumeCard';
import { translateTo } from '@brixel/brixel-components';
import { configureStore } from '../../store';
import { svgIcons } from '../Utilities/svgIcons';

// QUESTION LISTS
// eslint-disable-next-line default-param-last
export const QuestionsList = (lang, country = 'CH', propType) => {

  // VALIDATION OF FIELDS
  const maxLengthNum = (val, name) => (value) => {
    let error = null;
    if (value && value >= val) {
      error = translateTo(name === 'year' ? `Year can't be after ${val}` : `The ${name} have to be less then ${val}`, lang);
    }
    return error;
  };

  const minLengthNum = (val, name) => (value) => {
    let error = null;
    if (value && value <= val) {
      error = translateTo(name === 'year' ? `Too old! year can't be before ${val}` : `The ${name} have to be more then ${val}`, lang);
    }
    return error;
  };

  const minLengthNumYear = minLengthNum(1500, 'year');
  const maxLengthNumRooms = maxLengthNum(31, 'rooms');
  const maxLengthNumLivSpace = maxLengthNum(9999, 'living space');
  const maxLengthNumYear = maxLengthNum(2031, 'year');

  let propertyType = propType;
  if (configureStore && !propType) {
    propertyType = get(configureStore.getState(), 'brixelForm.GetStarted.values.properties.propertyType', '');
  }
  let livingAreaTitle = translateTo(country === 'PT' ? 'What is the gross area size?' : 'What is the living space size?', lang);
  if (propertyType === 'Commercial') livingAreaTitle = translateTo('What is the floor size?', lang);
  const question = [
    {
      title: translateTo('What type of property do you have?', lang),
      /* subtitle: translateTo('Choose between apartment, house, building land and commercial.'), */
      history: 'propertyType',
      footerWidth: 'max-w-fix-992',
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        classNameBox: 'max-w-fix-992 ml-a mr-a',
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
            label: translateTo('Building Land', lang),
            value: 'Building land',
            img: svgIcons.land,
            color: 'blue',
          },
          {
            label: translateTo('Commercial', lang),
            value: 'Commercial',
            img: svgIcons.commercial,
            color: 'blue',
          },
        ],
      }],
      successMessage: translateTo('Ok. Got it.', lang),
    },
  ];
  if (propertyType === 'Apartment' || propertyType === 'House') {
    question.push(
      {
        title: translateTo('How many rooms?'),
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
            large: true,
            tooltip: {
              label: translateTo('What is this?', lang),
              description: translateTo(country === 'PT' ? 'Enter the number of rooms, including rooms with a minimum surface of 9 m² (+1). Kitchen and bathrooms are not counted as a proper room.' : 'Enter the number of rooms that have a minimum surface of 8 m². Kitchen and bathrooms are not counted as a proper room.', lang),
            }
          },
        ],
        successMessage: translateTo('This is a nice number.', lang),
      },
      {
        title: livingAreaTitle,
        history: 'livingSpace',
        cardType: 'livingSpace',
        footerWidth: 'max-w-fix-384',
        showSendButton: false,
        inputs: [
          {
            component: BrixelInputText,
            classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
            className: '',
            label: country === 'PT' ? 'Gross area' : 'Net living space',
            name: country === 'PT' ? 'properties.typology.grossArea.value' : 'properties.typology.livingArea.value',
            type: 'number',
            validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
            unit: 'm2',
            placeholder: '117',
            maxLengthNum: 9999,
            large: true,
            tooltip: {
              label: translateTo('What is this?', lang),
              description: translateTo(country === 'PT' ? 'It is the total area measured by the external perimeter and axes of the walls or other separating elements of the building or property, including closed private balconies, basements, and private attics with the same use as the building or property. Open balconies, garages, and storage are excluded.' : 'The net living space is the part of the usable surface, which is specified for the primary use of the building. Included are entrance and courtyard, mobile walls, interior stairs, and fireplace. Excluded are external walls, internal walls, chimney, balcony, patio, attic, basement, rooms with room height under 1.2 m, and storerooms.', lang),
            }
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
            label: 'Construction year',
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
    );
  }
  if (propertyType === 'Building land') {
    question.push(
      {
        title: 'What is the lot size of the building land?',
        history: 'lotSize',
        cardType: 'lotSize',
        footerWidth: 'max-w-fix-384',
        showSendButton: false,
        inputs: [
          {
            component: BrixelInputText,
            classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
            className: '',
            label: 'Lot size',
            name: 'properties.typology.lotArea.value',
            type: 'number',
            validation: [Validation.required],
            unit: 'm2',
            placeholder: '117',
            maxLengthNum: 999999,
            large: true,
          },
        ],
        successMessage: translateTo('Great living space.', lang),
      },
      {
        title: 'What is the Usable lot size?',
        history: 'usableLotSize',
        cardType: 'usableLotSize',
        footerWidth: 'max-w-fix-384',
        showSendButton: false,
        inputs: [
          {
            component: BrixelInputText,
            classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
            className: '',
            label: 'Usable lot size',
            name: 'properties.typology.lotAreaUsable.value',
            type: 'number',
            unit: 'm2',
            placeholder: '117',
            maxLengthNum: 999999,
            large: true,
          },
        ],
        successMessage: translateTo('Great living space.', lang),
      },
    );
  }
  if (propertyType === 'Commercial') {
    question.push(
      {
        title: 'What kind of commercial property is it?',
        history: 'commercialType',
        cardType: 'commercialType',
        footerWidth: 'max-w-fix-384',
        showSendButton: false,
        inputs: [
          {
            component: BrixelRadioButton,
            classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
            className: '',
            name: 'properties.building.typeCommercialCode',
            options: factsOptions.typeCommercialCode,
            validation: [Validation.required],
          },
        ],
        successMessage: translateTo('Great living space.', lang),
      },
      {
        title: 'What\'s the floor space of the property?',
        history: 'commercialSize',
        cardType: 'commercialSize',
        footerWidth: 'max-w-fix-384',
        showSendButton: false,
        inputs: [
          {
            component: BrixelInputText,
            classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
            className: '',
            label: 'Floor space',
            name: 'properties.typology.floorSpace.value',
            type: 'number',
            unit: 'm2',
            placeholder: '117',
            maxLengthNum: 999999,
            large: true,
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
            label: 'Construction year',
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
    );
  }
  question.push(
    {
      title: translateTo('What is the location?', lang),
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
          },
          validation: [Validation.required],
        },
      ],
    },
  );
  if (country === 'PT') {
    question.push(
      {
        title: translateTo('Property condition', lang),
        history: 'propertyCondition',
        cardType: 'propertyCondition',
        footerWidth: 'max-w-fix-384',
        inputs: [
          {
            classNameBox: 'brdRadius max-w-fix-384 w-perc-100 px-2 px-sm-5 py-5 brdRadius fieldHolder bgWhite m-a',
            component: BrixelRadioButton,
            name: 'properties.building.conditionStatus',
            options: factsOptions.conditionStatus,
            validation: [Validation.required],
          }
        ],
      },
    );
  }
  question.push(
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
    },
    {
      hideProgress: true,
      history: 'savingData',
      cardType: 'createProfile',
      toSave: true,
    },
  );
  return question;
};
