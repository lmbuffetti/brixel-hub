/* eslint-disable max-len */
import {
  BrixelInputScale, BrixelInputText,
  BrixelRadioButton,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import LocalMarketCheck from '../Pages/MarketChecker/LocalMarketCheck';
import SuccessMarketCheck from '../Pages/MarketChecker/SuccessMarketCheck';

const { factsOptions } = FactsOptions;

export const AssessorQuestions = (lang) => [
  // SECTION: PROPERTY TYPE
  {
    title: "Sales strategy & price",
    description: "As an assessor, you know about condition of the most important parts of your property",
    history: "introAssessor",
    cardType: "introAssessor",
  },
  {
    title: "What's the basic construction material?",
    history: "constructionMaterials",
    cardType: "constructionMaterials",
    inputs: [
      {
        component: BrixelRadioButton,
        className: '',
        label: '',
        name: 'properties.building.constructionMaterials',
        options: factsOptions.constructionMaterials,
        icons: true,
      },
    ]
  },
  {
    title: "What type of roof",
    history: "roofType",
    cardType: "roofType",
    inputs: [
      {
        component: BrixelRadioButton,
        className: '',
        label: '',
        name: 'properties.building.roofType',
        options: factsOptions.roofType,
        icons: true,
      },
    ]
  },
  {
    title: "What heating system do you have?",
    history: "heating",
    cardType: "heating",
    inputs: [
      {
        component: BrixelRadioButton,
        className: '',
        label: '',
        name: 'properties.building.calHeating',
        options: factsOptions.heating,
        icons: true,
      },
    ]
  },
  {
    component: BrixelInputText,
    className: '',
    label: 'What\'s the construction year?',
    type: "number",
    name: 'properties.building.renovated',
    validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear],
    placeholder: "YYYY (ex.: 2020)",
  },
  {
    title: "Result Page",
    subtitle: "Sales strategy & price",
    history: "successLocalMarketCheck",
    cardType: "successLocalMarketCheck",
    component: SuccessMarketCheck,
  },
  {
    condition: {
      name: 'doneMarketCheck',
      value: false,
    },
    title: "Thank you Market Check",
    subtitle: "Sales strategy & price",
    history: "successLocalMarketCheck",
    cardType: "successLocalMarketCheck",
    component: SuccessMarketCheck,
  }
];
