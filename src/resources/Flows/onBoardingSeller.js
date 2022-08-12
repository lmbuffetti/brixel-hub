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
  let company = null;

  if (configureStore) {
    company = get(configureStore.getState(), 'brixelForm.GetStarted.values.company', '');
  }

  if (configureStore && !propType) {
    propertyType = get(configureStore.getState(), 'brixelForm.GetStarted.values.properties.propertyType', '');
  }
  let livingAreaTitle = translateTo(country === 'PT' ? 'What is the gross area size?' : 'What is the living space size?', lang);
  if (propertyType === 'Commercial') livingAreaTitle = translateTo('What is the floor size?', lang);

  const propertyTypeOptions = [
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
  ];
  if (company && (company !== 'baloise' && company !== 'ubs')) {
    propertyTypeOptions.push({
      label: translateTo('Commercial', lang),
      value: 'Commercial',
      img: svgIcons.commercial,
      color: 'blue',
    });
  }

  const question = [
    /* subtitle: translateTo('Choose between apartment, house, building land and commercial.'), */
    {
      title: translateTo('What type of property do you have?', lang),
      history: 'propertyType',
      footerWidth: 'max-w-fix-992',
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        classNameBox: 'max-w-fix-992 ml-a mr-a',
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
            label: translateTo('Number of rooms', lang),
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
        footerWidth: 'max-w-fix-400',
        showSendButton: false,
        inputs: [
          {
            component: BrixelInputText,
            classNameBox: 'brdRadius max-w-fix-400 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
            className: '',
            label: translateTo(country === 'PT' ? 'Gross area' : 'Net living space', lang),
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
    );
  }
  if (propertyType === 'Building land') {
    question.push(
      {
        title: translateTo('What is the lot size of the building land?', lang),
        history: 'lotSize',
        cardType: 'lotSize',
        footerWidth: 'max-w-fix-384',
        showSendButton: false,
        inputs: [
          {
            component: BrixelInputText,
            classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
            className: '',
            label: translateTo('Lot size', lang),
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
        title: translateTo('What is the Usable lot size?', lang),
        history: 'usableLotSize',
        cardType: 'usableLotSize',
        footerWidth: 'max-w-fix-384',
        showSendButton: false,
        inputs: [
          {
            component: BrixelInputText,
            classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
            className: '',
            label: translateTo('Usable lot size', lang),
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
        title: translateTo('What kind of commercial property is it?', lang),
        history: 'commercialType',
        cardType: 'commercialType',
        footerWidth: 'max-w-fix-600',
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
        title: translateTo('What\'s the floor space of the property?', lang),
        history: 'commercialSize',
        cardType: 'commercialSize',
        footerWidth: 'max-w-fix-384',
        showSendButton: false,
        inputs: [
          {
            component: BrixelInputText,
            classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
            className: '',
            label: translateTo('Floor space', lang),
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
  );
  if ((company !== 'baloise') && (company !== 'ubs')) {
    question.push(
      {
        hideProgress: true,
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
      title: translateTo('Activate your Baloise advantages now.', lang),
      history: 'baloiseInfo',
      cardType: 'baloiseInfo',
      footerWidth: 'max-w-fix-912',
      inputs: [
        {
          component: BrixelRadioButton,
          validation: [Validation.required],
          large: true,
          ReduxFieldClass: 'py-4 py-lg-0 w-perc-100',
          classNameBox: 'brdRadius max-w-fix-912 w-perc-100 px-2 px-sm-6 brdRadius fieldHolder bgWhite m-a',
          className: '',
          name: 'baloiseInfo',
          label: translateTo('What is your customer relationship with Baloise?', lang),
          bulletPoints: {
            title: translateTo('What are my advantages?', lang),
            description: [
              translateTo('You get CHF 1000 discount', lang),
              translateTo('You pay only if the sale is successful', lang),
              translateTo('You will be advised on your existing mortgage', lang),
            ]
          },
          options: [
            {
              label: translateTo('I am a customer of Baloise Insurance', lang),
              value: 'baloiseInsurance',
            },
            {
              label: translateTo('I am a customer at Baloise Bank SoBa', lang),
              value: 'baloiseBank',
            },
            {
              label: translateTo('I am already a client of both', lang),
              value: 'both',
            },
            {
              label: translateTo('I am not yet a Baloise customer', lang),
              value: 'notClient',
            },
          ],
        },
      ],
    });
  question.push(
    {
      conditions: [{
        name: 'baloiseInfo',
        value: 'both',
      }],
      title: translateTo('Almost there. Please accept the privacy policy.', lang),
      history: 'baloisePolicy',
      cardType: 'baloisePolicy',
      footerWidth: 'max-w-fix-752',
      text: [{
        title: translateTo('Transmission of data to Baloise Insurance.', lang),
        description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, phone number, e-mail) is transmitted to Basler Versicherung AG to check if I am eligible for the discount by comparing the data with my relevant data held by Basler Versicherung AG and to add the information that I use the Brixel service to my customer profile at Basler Versicherung AG to better meet my needs. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing based on the consent until revocation.', lang),
      },
      {
        title: translateTo('Transmission of data to Baloise Bank SoBa.', lang),
        description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, telephone number, e-mail) is transmitted to Baloise Bank SoBa AG to check if I am eligible for the discount by comparing the data with my relevant data held by Baloise Bank SoBa AG, and to add the information that I use the Brixel service to my customer profile at Baloise Bank SoBa AG to better meet my needs. For the aforementioned purposes, I release Baloise Bank SoBa AG as well as third parties commissioned by it from banking secrecy. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing carried out based on the consent until revocation.', lang),
      },]
    },
    {
      conditions: [{
        name: 'baloiseInfo',
        value: 'baloiseInsurance',
      }],
      title: translateTo('Almost there. Please accept the privacy policy.', lang),
      history: 'baloisePolicy',
      cardType: 'baloisePolicy',
      footerWidth: 'max-w-fix-752',
      text: [{
        title: translateTo('Transmission of data to Baloise Insurance.', lang),
        description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, phone number, e-mail) is transmitted to Basler Versicherung AG to check if I am eligible for the discount by comparing the data with my relevant data held by Basler Versicherung AG and to add the information that I use the Brixel service to my customer profile at Basler Versicherung AG to better meet my needs. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing based on the consent until revocation.', lang),
      },]
    },
    {
      conditions: [{
        name: 'baloiseInfo',
        value: 'baloiseBank',
      }],
      title: translateTo('Almost there. Please accept the privacy policy.', lang),
      history: 'baloisePolicy',
      cardType: 'baloisePolicy',
      footerWidth: 'max-w-fix-752',
      text: [{
        title: translateTo('Transmission of data to Baloise Bank SoBa.', lang),
        description: translateTo('I hereby agree that my data (last name, first name, street, house number, zip code, telephone number, e-mail) is transmitted to Baloise Bank SoBa AG to check if I am eligible for the discount by comparing the data with my relevant data held by Baloise Bank SoBa AG, and to add the information that I use the Brixel service to my customer profile at Baloise Bank SoBa AG to better meet my needs. For the aforementioned purposes, I release Baloise Bank SoBa AG as well as third parties commissioned by it from banking secrecy. You can revoke this consent at any time in the future. The revocation of consent does not affect the legality of the data processing carried out based on the consent until revocation.', lang),
      },]
    },
  );

  return question;
};
