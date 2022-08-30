/* eslint-disable max-len */
import { FactsOptions, translateTo } from '@brixel/brixel-components';
import {
  BrixelRadioButton,
  BrixelInputStepNumber,
  BrixelInputText,
  Validation,
} from '@brixel/brixel-components/dist/form';
import get from 'lodash/get';
import LoginSignup from '../../components/LoginSignup';
// import ResumeCard from '../components/ResumeCard';
import { configureStore } from '../../store';
import { svgIcons } from '../Utilities/svgIcons';

import { BestimateQuestions } from './Bestimate';
import MapsWithModalManual from '../../components/Map/MapsWithModalManual';

const { factsOptions } = FactsOptions;

// QUESTION LISTS
export const QuestionsList = (lang, country = 'CH') => {

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

  let propertyType = '';
  let company = null;

  if (configureStore) {
    propertyType = get(configureStore.getState(), 'brixelForm.GetStarted.values.properties.propertyType', '');
    company = get(configureStore.getState(), 'brixelForm.GetStarted.values.company', '');
  }
  let livingAreaTitle = translateTo(country === 'PT' ? 'What is the gross area size?' : 'What is the living space size?', lang);
  if (propertyType === 'Commercial') livingAreaTitle = translateTo( 'What is the floor size?', lang);
  const countryCode = get(configureStore.getState(), 'brixelForm.GetStarted.values.location.countryCode', '');

  const userTypeEstimation = factsOptions.userTypeEstimation.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));

  const question = [
    {
      title: translateTo( 'What is the estimation for?', lang),
      history: 'estimationType',
      footerWidth: 'max-w-fix-464',
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        pdClass: 'py-2 py-lg-3 px-2',
        label: '',
        ReduxFieldClass: 'max-w-fix-464 m-a',
        name: 'estimationType',
        validation: [Validation.required],
        large: true,
        icons: true,
        options: userTypeEstimation,
      }],
      successMessage: translateTo( 'Ok. Got it.', lang),
    },
    {
      title: translateTo( 'What type of property do you want to estimate?', lang),
      /* subtitle: translateTo( 'Choose between apartment and house.'), */
      history: 'propertyType',
      footerWidth: 'max-w-fix-584',
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg',
        classNameBox: 'max-w-fix-584 ml-a mr-a',
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
            label: translateTo( 'Apartment', lang),
            value: 'Apartment',
            img: svgIcons.apartment,
            color: 'blue',
          },
          {
            label: translateTo( 'House', lang),
            value: 'House',
            img: svgIcons.house,
            color: 'blue',
          },
        ],
      }],
      successMessage: translateTo( 'Ok. Got it.', lang),
    },
    {
      title: translateTo( 'How many rooms?', lang),
      history: 'allRooms',
      cardType: 'allRooms',
      footerWidth: 'max-w-fix-384',
      inputs: [
        {
          component: BrixelInputStepNumber,
          classNameBox: 'max-w-fix-384 w-perc-100 fieldHolder bgWhite brdRadius px-2 px-sm-5 py-5 m-a',
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
      successMessage: translateTo( 'This is a nice number.', lang),
    },
    {
      title: translateTo(livingAreaTitle, lang),
      history: 'livingSpace',
      cardType: 'livingSpace',
      footerWidth: 'max-w-fix-400',
      inputs: [
        {
          condition: [{
            name: 'properties.propertyType',
            noValue: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-400 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
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
        {
          condition: [{
            name: 'properties.propertyType',
            value: 'Commercial',
          }],
          component: BrixelInputText,
          classNameBox: 'brdRadius max-w-fix-384 px-2 px-sm-5 py-5 m-a fieldHolder bgWhite',
          label: translateTo('Floor space', lang),
          name: 'properties.typology.floorSpace.value',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          unit: 'm2',
          placeholder: translateTo( 'e.g. 120', lang),
          maxLengthNum: 9999,
          large: true,
        },
      ],
      successMessage: translateTo( 'Great living space.', lang),
    },
    {
      title: translateTo( 'What is the construction year?', lang),
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
          placeholder: translateTo( 'e.g. 1990', lang),
          validation: [Validation.positiveNumber, maxLengthNumYear, minLengthNumYear, Validation.required],
          maxLengthNum: 9999,
          minLengthNum: 999,
          large: true,
        },
      ],
      successMessage: translateTo( 'A good year for real estate.', lang),
    },
    {
      title: translateTo( 'What is the location?', lang),
      history: 'locationInput',
      cardType: 'locationInput',
      footerWidth: 'max-w-fix-600',
      className: 'fieldHolder bgWhite brdRadius max-w-fix-600 w-perc-100 m-a px-2 px-sm-5 py-5 dis-f flex-wrap',
      inputs: [
        {
          component: MapsWithModalManual,
          showMap: false,
          name: 'location.latitude',
          type: 'Map',
          classBoxWrapper: 'w-perc-100 flex- searchMapFields',
          mapOptions: {
            showMap: false,
            hideSearch: false,
            showSelectCountry: true,
            multipleFieldSearch: true,
            draggable: true,
          },
        },
      ],
      successMessage: translateTo( 'That is an interesting location.', lang),
    },
    {
      title: translateTo( 'Is this your correct location?', lang),
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
    /* {
      hideProgress: true,
      title: `${translateTo( 'Great, Your property was created!')} 🎉`,
      history: 'resume',
      cardType: 'loadComponent',
      component: ResumeCard,
      background: 'bgCardGreenDark',
      btnLabel: 'Continue',
    }, */
    ...BestimateQuestions('getStarted', countryCode, propertyType),
    {
      condition: [{
        name: 'owner',
        value: null,
      }],
      history: 'createProfile',
      background: 'bgCardGreen',
      component: LoginSignup,
      signupTitle: translateTo( 'Create your profile to save your progress.', lang),
      loginTitle: translateTo( 'Login to your profile to save your progress.', lang),
      cardType: 'createProfile',
      inputs: [{
        skipPhone: true,
        component: LoginSignup,
        name: 'register.name',
        validation: [Validation.required],
      }],
    },
  ];

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
      condition: [{
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
        description: `<span>${translateTo('I agree that my data (surname, first name, address, postal code, telephone number, e-mail) may be transmitted to UBS AG to verify my eligibility for the discount and to provide information that I am using the Brixel service to better meet my needs.', lang)}</span><span class="dis-b mt-2">${translateTo('This consent can be revoked at any time for the future. The revocation of consent does not affect the legality of the data processing carried out based on the consent until the revocation.', lang)}</span>`,
      },]
    }
  );
  question.push(
    {
      condition: [{
        name: 'company',
        value: 'baloise',
      },
      {
        name: 'estimationType',
        value: 'buyer',
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
  );
  question.push(
    {
      condition: [{
        name: 'company',
        value: 'baloise',
      },
      {
        name: 'estimationType',
        value: 'seller',
      }],
      title: translateTo('Activate your Baloise advantages now.', lang),
      history: 'baloiseInfo',
      cardType: 'baloiseInfo',
      footerWidth: 'max-w-fix-912',
      inputs: [
        {
          component: BrixelRadioButton,
          validation: [Validation.required],
          ReduxFieldClass: 'py-4 py-lg-0 w-perc-100',
          classNameBox: 'brdRadius max-w-fix-912 w-perc-100 px-2 px-sm-6 brdRadius fieldHolder bgWhite m-a',
          className: '',
          large: true,
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
      condition: [{
        name: 'baloiseInfo',
        value: 'both',
      },
      {
        name: 'estimationType',
        value: 'seller',
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
      condition: [{
        name: 'baloiseInfo',
        value: 'notClient',
      },
      {
        name: 'estimationType',
        value: 'seller',
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
      condition: [{
        name: 'baloiseInfo',
        value: 'baloiseInsurance',
      },
      {
        name: 'estimationType',
        value: 'seller',
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
      condition: [{
        name: 'baloiseInfo',
        value: 'baloiseBank',
      },
      {
        name: 'estimationType',
        value: 'seller',
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
