/* eslint-disable max-len */
import {
  BrixelInputScale, BrixelInputText,
  BrixelRadioButton,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeAssessor from '../Pages/Assessor/ResumeAssessor';
import SuccessMarketCheck from '../Pages/Assessor/SuccessAssessor';

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
        name: 'properties.building.energy.heating',
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
    history: "resumeAssessor",
    cardType: "resumeAssessor",
    component: ResumeAssessor,
  },
  {
    condition: {
      name: 'doneMarketCheck',
      value: false,
    },
    title: "Thank you Market Check",
    subtitle: "Sales strategy & price",
    history: "successAssessor",
    cardType: "successAssessor",
    component: SuccessMarketCheck,
  }
];

export const AssessorAvgLifespan = {
  construction: {
    wood: 80,
    cement: 115,
    brick: 115,
  },
  roof: {
    flat: 30,
    pitched: 50,
  },
  facade: {
    Plastered: 35,
    Painted: 25,
    EternitCement: 45,
    NaturalWood: 25,
  },
  heating: {
    oil: 15,
    gas: 15,
    wood: 20,
    solar: 20,
    electric: 20,
    heatPump: 20,
    districtHeater: 25,
    combinedHeatPowerPlant: 25,
    other: 20,
  },
  kitchen: 15,
  wetCells: 30,
  electricalSystems: 35,
};
