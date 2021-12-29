/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
import {
  BrixelCheckbox,
  BrixelInputText,
  BrixelRadioButton,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeAssessor from '../Pages/Assessor/ResumeAssessor';
import { translateTo } from '../utils/translation';

const { factsOptions } = FactsOptions;

export const AssessorQuestions = (lang = 'en') => [
  {
    title: "What's the basic construction material?",
    vCentered: true,
    history: 'constructionMaterials',
    cardType: 'constructionMaterials',
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-lg-3 px-1',
        className: '',
        label: '',
        name: 'properties.building.constructionMaterials',
        options: factsOptions.constructionMaterials,
        icons: true,
      },
    ],
  },
  {
    title: 'What type of roof?',
    history: 'roofType',
    vCentered: true,
    cardType: 'roofType',
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-lg-3 px-1',
        className: '',
        label: '',
        name: 'properties.building.roofType',
        options: factsOptions.roofType,
        icons: true,
      },
    ],
  },
  {
    title: "What's the kind of facade?",
    history: 'facade',
    vCentered: true,
    cardType: 'facade',
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-lg-3 px-1',
        className: '',
        label: '',
        name: 'properties.building.facade',
        options: factsOptions.facade,
        icons: true,
      },
    ],
  },
  {
    title: 'What heating system do you have?',
    history: 'heating',
    vCentered: true,
    cardType: 'heating',
    inputs: [
      {
        component: BrixelCheckbox,
        pdClass: 'py-3 pl-1 pr-2',
        className: '',
        label: '',
        name: 'properties.energy.heating',
        options: factsOptions.heating,
        icons: true,
        limit: 10,
      },
    ],
  },
  {
    title: 'When was your last renovation?',
    history: 'yearRenovation',
    cardType: 'yearRenovation',
    inputs: [
      {
        component: BrixelInputText,
        className: '',
        hint: 'Insert the year of your last big renovation or leave it empty',
        type: 'number',
        name: 'properties.building.renovated',
        validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear],
        classNameBox: 'bgLight100 p-1 brdRadius max-w-fix-lg-232',
        placeholder: translateTo(lang, 'e.g. 1990'),
        minLenghtNum: 999,
        maxLengthNum: 9999,
      },
    ],
  },
  {
    title: 'Result Page',
    toSave: true,
    subtitle: 'Sales strategy & price',
    vCentered: true,
    history: 'resumeFlow',
    cardType: 'loadComponent',
    component: ResumeAssessor,
    resumeFlow: true,
  },
];

export const AssessorAvgLifespan = {
  ch: {
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
  },
  pt: {
    construction: {
      wood: 30,
      cement: 36,
      brick: 56,
    },
    roof: {
      flat: 26,
      pitched: 43,
    },
    facade: {
      plastered: 41,
      painted: 15,
      eternitCement: 45,
      naturalWood: 20,
    },
    heating: {
      oil: 20,
      gas: 30,
      wood: 20,
      solar: 30,
      electric: 20,
      heatPump: 15,
      districtHeater: 25,
      combinedHeatPowerPlant: 25,
      other: 20,
    },
    kitchen: 20,
    wetCells: 20,
    electricalSystems: 30,
  },
};

export const AssessorLabel = {
  construction: 'Construction',
  roof: 'Roof',
  facade: 'Facade',
  heating: 'Heating',
  kitchen: 'Kitchen',
  wetCells: 'Wet Cells',
  electricalSystems: 'Electrical Systems',
};
