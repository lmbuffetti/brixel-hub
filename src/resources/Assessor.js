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
    title: "What was your last renovation?",
    history: "yearRenovation",
    cardType: "yearRenovation",
    inputs: [
      {
        component: BrixelInputText,
        className: '',
        label: 'Insert the year of your last big renovation or leave it empty',
        type: "number",
        name: 'properties.building.renovated',
        validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear],
        placeholder: "YYYY (ex.: 2020)",
      },
    ]
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

export const AssessorAvgLifespan = {
  construction: {
    Wood: 80,
    Cement: 115,
    Brick: 115,
  },
  roof: {
    Flat: 30,
    Pitched: 50,
  },
  facade: {
    Plastered: 35,
    Painted: 25,
    EternitCement: 45,
    NaturalWood: 25,
  },
  heating: {
    Oil: 15,
    Gas: 15,
    Wood: 20,
    Solar: 20,
    Electric: 20,
    HeatPump: 20,
    DistrictHeater: 25,
    CombinedHeatAndPowerPlant: 25,
    Other: 20,
  },
  Kitchen: 15,
  WetCells: 30,
  ElectricalSystems: 35,
};
