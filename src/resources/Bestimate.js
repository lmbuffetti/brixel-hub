/* eslint-disable max-len */
import {
  BrixelInputStepNumber,
  BrixelExtraFeature,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeBestimate from '../Pages/Bestimate/ResumeBestimate';
import SuccessBestimate from '../Pages/Bestimate/SuccessBestimate';
import startBestimate from '../images/Bestimate/startBestimate.svg';

const { factsOptions } = FactsOptions;

export const BestimateQuestions = (lang) => [
  {
    title: "Get a free price indication",
    img: startBestimate,
    description: "Compare your property to real transaction data to better define the pricing.",
    history: "introBestimate",
    cardType: "introBestimate",
  },
  {
    title: "How many bathrooms do you have?",
    history: "bathrooms",
    cardType: "bathrooms",
    inputs: [
      {
        component: BrixelInputStepNumber,
        classNameBox: 'max-w-fix-md-232',
        label: '',
        name: 'properties.typology.bathrooms',
        step: 1,
        validation: [Validation.maxLengthNumRooms, Validation.markRequired]
      },
    ]
  },
  {
    title: "Which extra features do you have?",
    className: "vertCentered",
    history: "extraFeatures",
    cardType: "extraFeatures",
    toSave: true,
    inputs: [
      {
        component: BrixelExtraFeature,
        className: '',
        label: 'Extra features',
        name: 'properties.extraFeatures',
        options: factsOptions.BrixelExtraFeature,
        validation: [Validation.markRequired],
      },
    ]
  },
  {
    title: "Result Page",
    className: "vertCentered",
    subtitle: "Sales strategy & price",
    history: "resumeFlow",
    cardType: "loadComponent",
    component: ResumeBestimate,
  },
  {
    title: "Thank you Market Check",
    className: "vertCentered",
    subtitle: "Sales strategy & price",
    history: "successAchievement",
    cardType: "loadComponent",
    component: SuccessBestimate,
  },
];
