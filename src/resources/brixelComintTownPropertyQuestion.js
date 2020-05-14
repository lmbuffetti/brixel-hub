import {
  BrixelRadioButton,
  BrixelInputStepNumber,
  BrixelInputText,
  Validation,
  ReduxField,
} from '@brixel/brixel-components';
import Cat from '../images/BrxielComingTown/firstAwards.svg';
import Maps from '../components/Map/Maps';
import LoginSignup from '../components/LoginSignup';
import apartment from '../images/BrxielComingTown/apartment.svg';
import house from '../images/BrxielComingTown/house.svg';
import ResumeCard from '../components/ResumeCard';
import { translateTo } from '../utils/translation';
import React from 'react';

export const maxLengthNum = (val, name) => (value) => {

  const error = !value || (value < val)
    ? null
    : name === 'year' ?
      `Year can't be after ${val}` : `The ${name} have to be less then ${val}`;

  return error;
};

export const minLengthNum = (val, name) => (value) => {
  const error = !value || (value >= val)
    ? null
    : name === 'year' ?
      `Too old! year can't be before ${val}` : `The ${name} have to be more then ${val}`;

  return error;
};

const minLengthNumYear = minLengthNum(1500, 'year');
const maxLengthNumRooms = maxLengthNum(30, 'rooms');
const maxLengthNumLivSpace = maxLengthNum(9999, 'living space');
const maxLengthNumYear = maxLengthNum(2031, 'year');


export const QuestionsList = (lang, country = 'CH') => {
  let getHomeBase = {name: 'Homebase', points: 100};
  return [
    {
      titleGreen: translateTo(lang, 'Hello, let\'s get started.'),
      title: translateTo(lang, "What type of property do you have?"),
      history: "propertyType",
      vCentered: true,
      inputs: [{
        component: BrixelRadioButton,
        className: 'radioBtnImg max-w-fix-md-464',
        pdClass: 'py-2 py-md-3 px-1',
        label: '',
        name: 'propertyType',
        validation: [Validation.required],
        icons: true,
        options: [
          {
            label: translateTo(lang, "Apartment"),
            value: "Apartment",
            img: apartment,
          },
          {
            label: translateTo(lang, "House"),
            value: "House",
            img: house,

          }
        ],
      }],
      successMessage: translateTo(lang, 'Ok. Got it.')
    },
    {
      title: translateTo(lang, "How many rooms?"),
      history: "allRooms",
      cardType: "allRooms",
      inputs: [
        {
          component: BrixelInputStepNumber,
          classNameBox: 'max-w-fix-md-232',
          label: '',
          name: 'bedrooms',
          validation: [maxLengthNumRooms, Validation.positiveNumber, Validation.required],
          step: country === 'CH' ? 0.5 : 1,
          min: 1,
        },
      ],
      successMessage: translateTo(lang, 'This is a nice number.')
    },
    {
      title: translateTo(lang, "What is the living space size?"),
      history: "livingSpace",
      cardType: "livingSpace",
      inputs: [
        {
          component: BrixelInputText,
          className: 'max-w-fix-md-232',
          label: '',
          name: 'livingSpace',
          type: 'number',
          validation: [Validation.isNumber, Validation.positiveNumber, maxLengthNumLivSpace, Validation.required],
          help: translateTo(lang, 'Use net living space'),
          unit: 'm2',
          classNameBox: 'brdRadius max-w-fix-md-288',
          placeholder: translateTo(lang, 'e.g. 120'),
        },
      ],
      successMessage: translateTo(lang, 'Great living space.')
    },
    {
      title: translateTo(lang, "What is the construction year?"),
      history: "constructionYear",
      cardType: "constructionYear",
      inputs: [
        {
          component: BrixelInputText,
          label: '',
          name: 'constructionYear',
          type: 'number',
          classNameBox: 'brdRadius max-w-fix-md-232',
          placeholder: translateTo(lang, 'e.g. 1990'),
          validation: [minLengthNumYear, Validation.positiveNumber, maxLengthNumYear, Validation.required],
          minLenghtNum: 999,
          maxLenghtNum: 9999,
        },
      ],
      successMessage: translateTo(lang, 'A good year for real estate.')
    },
    {
      title: translateTo(lang, "What is the location?"),
      history: "locationInput",
      cardType: "locationInput",
      inputs: [
        {
          component: Maps,
          showMap: true,
          name: 'location',
          type: 'Map',
          mapOptions: {
            showMap: true,
            showSearchLocation: true,
            showSelectCountry: true,
          },
          validation: [Validation.required],
        },
      ],
      successMessage: translateTo(lang, "That is an interesting location.")
    },
    {
      title: translateTo(lang, "Great, Your property was created!") + " 🎉",
      history: "resume",
      className: 'willAnimate',
      cardType: 'loadComponent',
      component: ResumeCard,
      background: 'bgRed100',
    },
    {
      conditions: [{
        name: 'owner',
        value: null,
      }],
      title: translateTo(lang, "And the first award goes to…You!"),
      subtitle: translateTo(lang, `You earned the <span class="txtGreen400">"${getHomeBase.name}"</span> Award and +${getHomeBase.points} Brixels.`),
      history: "rewardsStep",
      className: 'willAnimate',
      cardType: 'card',
      background: 'bgPrimary100',
      img: Cat,
    },
    {
      component: LoginSignup,
      signupTitle: translateTo(lang, "Create your profile to save your progress."),
      loginTitle: translateTo(lang, "Login to your profile to save your progress."),
      history: "createProfile",
      cardType: 'createProfile',
      inputs: [{
        component: LoginSignup,
        name: 'owner',
        validation: [Validation.required],
      }],
    },
  ];
}
