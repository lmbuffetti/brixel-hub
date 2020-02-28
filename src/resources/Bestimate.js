/* eslint-disable max-len */
import {
  BrixelInputStepNumber,
  BrixelExtraFeature,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import SuccessBestimate from '../Pages/Bestimate/SuccessBestimate';

const { factsOptions } = FactsOptions;

export const BestimateQuestions = (lang) => [
  {
    title: "Get a free price indication",
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
        className: '',
        label: '',
        name: 'properties.typology.bathrooms',
        step: 1,
        validation: [Validation.maxLengthNumRooms, Validation.markRequired]
      },
    ]
  },
  {
    title: "Which extra features do you have?",
    history: "extraFeatures",
    cardType: "extraFeatures",
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
    condition: {
      name: 'doneBestimate',
      value: false,
    },
    title: "Thank you Bestimate",
    subtitle: "Bestimate",
    history: "successBestimate",
    cardType: "successBestimate",
    component: SuccessBestimate,
  }
];
