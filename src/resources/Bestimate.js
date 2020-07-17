/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelExtraFeature,
  BrixelInputQuality,
  BrixelRadioButton,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeBestimate from '../Pages/GameHistory/Bestimate/ResumeBestimate';

const { factsOptions } = FactsOptions;

export const BestimateQuestions = () => [
  {
    title: 'Step 1',
    extraInfo: 'We need some extra information about your property.',
    history: 'bathrooms',
    cardType: 'bathrooms',
    inputs: [
      {
        condition: [{
          name: 'location.countryCode',
          value: 'PT',
        }],
        component: BrixelRadioButton,
        label: 'Property condition',
        name: 'properties.building.conditionStatus',
        options: factsOptions.conditionStatus,
        validation: [Validation.markRequired],
      },
      {
        condition: [{
          name: 'location.countryCode',
          value: 'PT',
        }],
        component: BrixelInputText,
        className: '',
        label: 'What\'s the gross size of the property?',
        labelLeft: 'Gross size',
        placeholder: '120',
        unit: 'm2',
        minLengthNum: 1,
        maxLenghtNum: 5000,
        name: 'properties.typology.grossArea.value',
        type: 'number',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputStepNumber,
        className: '',
        label: 'How many bathrooms does the property have?',
        name: 'properties.typology.bathrooms',
        labelLeft: 'Bathrooms',
        step: 1,
        min: 0,
        max: 15,
        placeholder: '0',
        validation: [Validation.maxLengthNumRooms, Validation.markRequired],
      },
    ],
  },
  {
    condition: [{
      name: 'location.countryCode',
      value: 'PT',
    }],
    title: 'STEP 2',
    vCentered: true,
    history: 'extraFeatures',
    cardType: 'extraFeatures',
    inputs: [
      {
        component: BrixelInputStepNumber,
        className: '',
        label: 'How many garage parking lots belong to the property?',
        name: 'properties.parking.garage',
        labelLeft: 'Garage parking',
        step: 1,
        min: 0,
        max: 99,
        placeholder: '0',
        validation: [Validation.markRequired],
      },
      {
        component: BrixelInputQuality,
        className: '',
        label: 'What\'s the energy efficiency of the property?',
        name: 'properties.energy.efficiency',
        options: factsOptions.energyEfficiencyOptions,
        validation: [Validation.markRequired],
      },
    ],
  },
  {
    condition: [{
      name: 'location.countryCode',
      value: 'CH',
    }],
    title: 'Which extra features do you have?',
    vCentered: true,
    history: 'extraFeatures',
    cardType: 'extraFeatures',
    inputs: [
      {
        component: BrixelExtraFeature,
        label: 'Extra features',
        name: 'properties.extraFeatures',
        pdClass: 'p-1',
        iconClass: 'p-small-17 fSizePx22 bgPrimary400 txtWhite brdRadius mr-1',
        options: factsOptions.BrixelExtraFeature,
      },
    ],
  },
  {
    condition: [{
      name: 'location.countryCode',
      value: 'PT',
    }],
    title: 'Which extra features do you have?',
    vCentered: true,
    history: 'step3',
    cardType: 'extraFeatures',
    inputs: [
      {
        component: BrixelCheckbox,
        label: '',
        name: 'properties.extraFeaturesBestimatePT',
        pdClass: 'p-1',
        iconClass: 'p-small-17 fSizePx22 bgPrimary400 txtWhite brdRadius mr-1',
        options: factsOptions.extraFeatureBestimatePT,
      },
    ],
  },
  {
    title: 'Result Page',
    toSave: true,
    vCentered: true,
    subtitle: 'Sales strategy & price',
    history: 'resumeFlow',
    cardType: 'loadComponent',
    component: ResumeBestimate,
  },
];
