/* eslint-disable max-len */
import get from 'lodash/get';
import {
  BrixelCheckbox,
  BrixelExtraFeature, BrixelInputScale,
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelRadioButton,
  BrixelTextArea,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import Maps from '../components/Map/Maps';
import { configureStore } from '../store';
const { factsOptions } = FactsOptions;

export const FactsApartment = () => {
  const formValue = get(configureStore.getState(), 'form.GamingFlow.values', {});
  const country = get(formValue, 'location.countryCode', '');
  return [
    // SECTION: PROPERTY TYPE
    {
      className: 'radioBtnImg',
      group: "Type",
      title: "Step 1",
      history: "step1",
      cardType: "step1",
      inputs: [
        {
          component: BrixelRadioButton,
          className: '',
          label: 'What\'s the type of the apartment?',
          name: 'properties.building.typeFlatCode',
          options: factsOptions.typeFlatCode,
        },
        {
          component: BrixelInputStepNumber,
          className: '',
          label: 'How many bathrooms does the property have?',
          name: 'properties.typology.bathrooms',
          labelLeft: 'Bathrooms',
          step: 1,
          placeholder: '0',
          validation: [Validation.maxLengthNumRooms]
        },
        {
          component: BrixelInputScale,
          className: '',
          label: 'How is the condition of the apartment?',
          name: 'properties.building.apartmentQuality',
          options: factsOptions.quality,
        },
      ]
    },
    {
      className: 'radioBtnImg',
      group: "Type",
      title: "Step 2",
      history: "step2",
      cardType: "step2",
      inputs: [
        {
          component: BrixelExtraFeature,
          className: '',
          label: 'Extra features',
          name: 'properties.extraFeatures',
          options: factsOptions.BrixelExtraFeature,
        },
      ],
    },
    {
      className: 'radioBtnImg',
      group: "Type",
      title: "Step 3",
      history: "step3",
      cardType: "step3",
      inputs: [
        {
          component: BrixelRadioButton,
          className: 'helpLink',
          label: 'Is the property renovated?',
          name: 'properties.building.isPropertyRenovated',
          options: factsOptions.isPropertyRenovatedOptions,
        },
        {
          condition: [{
            name: 'properties.building.isPropertyRenovated',
            value: 1
          }],
          component: BrixelInputText,
          className: '',
          label: 'If yes, when was the property last time renovated?',
          name: 'properties.building.renovated',
          labelLeft: 'Year',
          placeholder: 'YYYY (ex.: 2020)',
          validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear, Validation.markRequired],
          formatType: 'date-yyyy',
          minLenght: 999,
          maxLength: 2030,
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the surface of the balcony?',
          unit: 'm2',
          placeholder: '140',
          labelLeft: 'Balcony',
          name: 'properties.typology.balconyArea.value',
          type: 'number',
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What\'s the size of the garden?',
          labelLeft: 'Garden',
          unit: 'm2',
          name: 'properties.typology.gardenArea.value',
          type: 'number',
          placeholder: '140',
          validation: [Validation.markRequired],
        },
      ],
    },
    {
      className: 'radioBtnImg',
      group: "Type",
      title: "Step 4",
      history: "step4",
      cardType: "step4",
      inputs: [
        {
          component: BrixelInputStepNumber,
          className: '',
          label: 'How many garage parking lots belong to the property?',
          name: 'properties.parking.garage',
          labelLeft: 'Garage parking',
          step: 1,
          placeholder: '0',
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputStepNumber,
          className: '',
          placeholder: '0',
          label: 'How many external parking lots belong to the property?',
          name: 'properties.parking.outside',
          labelLeft: 'External parking',
          step: 1,
          validation: [Validation.markRequired]
        },
        {
          component: BrixelInputStepNumber,
          className: '',
          label: 'How many underground parking lots belong to the property?',
          labelLeft: 'Underground parking',
          name: 'properties.parking.underground',
          step: 1,
          placeholder: '0',
          validation: [Validation.markRequired]
        },
        {
          component: BrixelCheckbox,
          className: 'mb-2',
          label: 'What\'s the heating system?',
          name: 'properties.energy.heating',
          options: factsOptions.heating,
          validation: [Validation.markRequired],
        },
      ],
    },
    {
      className: 'radioBtnImg',
      group: "Type",
      title: "Step 5",
      history: "step5",
      cardType: "step5",
      inputs: [
        {
          component: BrixelInputText,
          className: '',
          label: 'What is the selling price of the house?',
          labelLeft: 'Price',
          placeholder: '1’500’000',
          name: 'price.total',
          formatType: 'price',
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          component: BrixelInputText,
          className: '',
          label: 'What are the additional costs per year?',
          placeholder: '7400',
          name: 'properties.building.maintenanceCost',
          labelLeft: 'Additional costs',
          formatType: 'price',
          validation: [Validation.markRequired],
          unit: get(formValue, 'price.currency', 'CHF'),
        },
        {
          component: BrixelRadioButton,
          className: '',
          label: 'Availability of sale',
          name: 'properties.typology.availability',
          options: factsOptions.availability,
          validation: [Validation.markRequired],
        },
      ],
    },
    {
      className: 'radioBtnImg',
      group: "Type",
      title: "Step 6",
      history: "step6",
      cardType: "step6",
      inputs: [
        {
          component: BrixelInputText,
          className: '',
          label: 'Title',
          name: 'title',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelTextArea,
          className: '',
          label: 'What are the highlights of the property?',
          placeholder: 'Add some description about the highlights of your property. Try to think about your potential buyers.',
          name: 'description.highlight',
          validation: [Validation.markRequired],
        },
      ],
    },
  ];
}
