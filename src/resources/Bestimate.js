/* eslint-disable max-len */
import {
  BrixelInputStepNumber,
  BrixelExtraFeature,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeBestimate from '../Pages/GameHistory/Bestimate/ResumeBestimate';

const { factsOptions } = FactsOptions;

export const BestimateQuestions = (lang) => [
  {
    title: "How many bathrooms do you have?",
    extraInfo: "We need some extra information about your property.",
    history: "bathrooms",
    cardType: "bathrooms",
    inputs: [
      {
        component: BrixelInputStepNumber,
        classNameBox: 'max-w-fix-md-232',
        label: '',
        name: 'properties.typology.bathrooms',
        step: 1,
        validation: [Validation.maxLengthNumRooms, Validation.required]
      },
    ]
  },
  {
    title: "Which extra features do you have?",
    vCentered: true,
    history: "extraFeatures",
    cardType: "extraFeatures",
    inputs: [
      {
        component: BrixelExtraFeature,
        label: 'Extra features',
        name: 'properties.extraFeatures',
        pdClass: 'p-1',
        iconClass: 'p-small-17 fSizePx22 bgPrimary400 txtWhite brdRadius mr-1',
        options: factsOptions.BrixelExtraFeature,
      },
    ]
  },
  {
    title: "Result Page",
    toSave: true,
    vCentered: true,
    subtitle: "Sales strategy & price",
    history: "resumeFlow",
    cardType: "loadComponent",
    component: ResumeBestimate,
  },
];
