/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelInputText,
  BrixelRadioButton,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeAssessor from '../Pages/Assessor/ResumeAssessor';
import SuccessAssessor from '../Pages/Assessor/SuccessAssessor';
import becomeAssessor from '../images/Assessor/becomeAssessor.svg';
import { translateTo } from '../utils/translation';

const { factsOptions } = FactsOptions;

export const AssessorQuestions = (lang) => [
  // SECTION: PROPERTY TYPE
  {
    background: 'bgGreen100',
    img: becomeAssessor,
    title: "Assess your property with a condition check",
    description: "As an assessor, you know about the condition of the most important parts of your property.",
    history: "introFlow",
    cardType: "text",
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
    title: "What's the kind of facade?",
    history: "facade",
    cardType: "facade",
    inputs: [
      {
        component: BrixelRadioButton,
        className: '',
        label: '',
        name: 'properties.building.facade',
        options: factsOptions.facade,
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
        component: BrixelCheckbox,
        className: '',
        label: '',
        name: 'properties.building.energy.heating',
        options: factsOptions.heating,
        icons: true,
        limit: 10,
      },
    ]
  },
  {
    title: "What was your last renovation?",
    history: "yearRenovation",
    cardType: "yearRenovation",
    toSave: true,
    inputs: [
      {
        component: BrixelInputText,
        className: '',
        hint: 'Insert the year of your last big renovation or leave it empty',
        type: "number",
        name: 'properties.building.renovated',
        validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear],
        classNameBox: 'bgLight100 p-1 brdRadius max-w-fix-md-232',
        placeholder: translateTo(lang, 'e.g. 1990'),
        minLenghtNum: 999,
        maxLenghtNum: 9999,
      },
    ]
  },
  {
    title: "Result Page",
    subtitle: "Sales strategy & price",
    history: "resumeFlow",
    cardType: "loadComponent",
    component: ResumeAssessor,
  },
  {
    title: "Thank you Market Check",
    subtitle: "Sales strategy & price",
    history: "successAchievement",
    cardType: "loadComponent",
    component: SuccessAssessor,
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
    plastered: 35,
    painted: 25,
    eternitCement: 45,
    naturalWood: 25,
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
