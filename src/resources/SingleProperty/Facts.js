/* eslint-disable max-len */
import get from 'lodash/get';
import {
  FactsOptions,
} from '@brixel/brixel-components';
import {
  BrixelCheckbox,
  BrixelExtraFeature,
  BrixelInputScale,
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelRadioButton,
  BrixelTextArea,
  Validation,
} from '@brixel/brixel-components/dist/form';
import { configureStore } from '../../store';

const { factsOptions } = FactsOptions;

export const FactsApartment = () => {
  const formValue = get(configureStore.getState(), 'brixelForm.GamingFlow.values', {});
  if (get(formValue, 'properties.propertyType', null) === 'Apartment') {
    return [
      // SECTION: PROPERTY TYPE APARTMENT
      // STEP 1
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 1',
        history: 'step1',
        cardType: 'step1',
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
            min: 0,
            max: 15,
            placeholder: '0',
            validation: [Validation.maxLengthNumRooms],
          },
          {
            component: BrixelInputScale,
            className: '',
            label: 'How is the condition of the apartment?',
            name: 'properties.building.apartmentQuality',
            options: factsOptions.quality,
          },
        ],
      },
      // STEP 2
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 2',
        history: 'step2',
        cardType: 'step2',
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
      // STEP 3
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 3',
        history: 'step3',
        cardType: 'step3',
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
              value: 1,
            }],
            component: BrixelInputText,
            className: '',
            label: 'If yes, when was the property last time renovated?',
            name: 'properties.building.renovated',
            labelLeft: 'Year',
            placeholder: 'YYYY (ex.: 2020)',
            validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear],
            formatType: 'date-yyyy',
            minLenght: 999,
            maxLength: 9999,
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
            minLengthNum: 1,
            maxLengthNum: 999,
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
            minLengthNum: 1,
            maxLengthNum: 9999,
          },
        ],
      },
      // STEP 4
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 4',
        history: 'step4',
        cardType: 'step4',
        inputs: [
          {
            component: BrixelInputStepNumber,
            className: '',
            label: 'How many garage parking lots belong to the property?',
            name: 'properties.parking.garage',
            labelLeft: 'Garage parking',
            step: 1,
            placeholder: '0',
          },
          {
            component: BrixelInputStepNumber,
            className: '',
            placeholder: '0',
            label: 'How many external parking lots belong to the property?',
            name: 'properties.parking.outside',
            labelLeft: 'External parking',
            step: 1,
          },
          {
            component: BrixelInputStepNumber,
            className: '',
            label: 'How many underground parking lots belong to the property?',
            labelLeft: 'Underground parking',
            name: 'properties.parking.underground',
            step: 1,
            placeholder: '0',
          },
          {
            component: BrixelCheckbox,
            className: 'mb-2',
            label: 'What\'s the heating system?',
            name: 'properties.energy.heating',
            options: factsOptions.heating,
          },
        ],
      },
      // STEP 5
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 5',
        history: 'step5',
        cardType: 'step5',
        inputs: [
          {
            component: BrixelInputText,
            className: '',
            label: 'What is the selling price of the house?',
            labelLeft: 'Price',
            placeholder: '1’500’000',
            name: 'price.total',
            formatType: 'price',
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
            unit: get(formValue, 'price.currency', 'CHF'),
          },
          {
            component: BrixelRadioButton,
            className: '',
            label: 'Availability of sale',
            name: 'properties.typology.availability',
            options: factsOptions.availability,
          },
          {
            condition: [{
              name: 'properties.typology.availability',
              value: 'other',
            }],
            component: BrixelInputText,
            className: '',
            label: 'What\'s the preferred time of sale?',
            name: 'properties.typology.availabilityText',
            validation: [Validation.markRequired],
          },
        ],
      },
      // STEP 6
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 6',
        history: 'step6',
        cardType: 'step6',
        inputs: [
          {
            component: BrixelInputText,
            className: '',
            label: 'Title',
            name: 'title',
          },
          {
            component: BrixelTextArea,
            className: '',
            label: 'What are the highlights of the property?',
            placeholder: 'Add some description about the highlights of your property. Try to think about your potential buyers.',
            name: 'description.highlight',
          },
        ],
      },
      // STEP TO SAVE
      {
        history: 'success',
        toSave: true,
      },
    ];
  }
  if (get(formValue, 'properties.propertyType', null) === 'House') {
    return [
      // SECTION: PROPERTY TYPE HOUSE
      // STEP 1
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 1',
        history: 'step1',
        cardType: 'step1',
        inputs: [

          {
            component: BrixelRadioButton,
            className: '',
            label: 'What\'s the type of the house?',
            name: 'properties.building.typeHouseCode',
            options: factsOptions.typeHouseCode,
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
            validation: [Validation.maxLengthNumRooms],
          },
          {
            component: BrixelInputText,
            className: '',
            label: 'What\'s the lot size?',
            name: 'properties.typology.lotArea.value',
            type: 'number',
            unit: 'm2',
            minLengthNum: 1,
            maxLengthNum: 99999,
            labelLeft: 'Lot Size',
            placeholder: 'e.g. 140',
          },
          {
            component: BrixelInputText,
            className: '',
            label: 'What\'s the house\'s volume?',
            unit: 'm3',
            labelLeft: 'Volume',
            minLengthNum: 1,
            maxLengthNum: 99999,
            name: 'properties.typology.constructedVolume.value',
            type: 'number',
          },
          {
            component: BrixelInputScale,
            className: 'helpLink',
            label: 'In which condition is the property?',
            name: 'properties.building.conditionCode',
            options: factsOptions.quality,
          },
        ],
      },
      // STEP 2
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 2',
        history: 'step2',
        cardType: 'step2',
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
      // STEP 3
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 3',
        history: 'step3',
        cardType: 'step3',
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
              value: 1,
            }],
            component: BrixelInputText,
            className: '',
            label: 'If yes, when was the property last time renovated?',
            name: 'properties.building.renovated',
            labelLeft: 'Year',
            placeholder: 'YYYY (ex.: 2020)',
            validation: [Validation.maxLengthNumYear, Validation.minLengthNumYear],
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
            minLengthNum: 1,
            maxLengthNum: 999,
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
            minLengthNum: 1,
            maxLengthNum: 9999,
          },
          {
            component: BrixelInputText,
            className: '',
            label: 'What\'s the size of the attic?',
            labelLeft: 'Attic',
            unit: 'm2',
            placeholder: '25',
            type: 'number',
            name: 'properties.building.expandableAtticArea.value',
            minLengthNum: 1,
            maxLengthNum: 999,
          },
        ],
      },
      // STEP 4
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 4',
        history: 'step4',
        cardType: 'step4',
        inputs: [
          {
            component: BrixelCheckbox,
            className: 'mb-2',
            label: 'What\'s the heating system?',
            name: 'properties.energy.heating',
            options: factsOptions.heating,
          },
        ],
      },
      // STEP 5
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 5',
        history: 'step5',
        cardType: 'step5',
        inputs: [
          {
            component: BrixelInputText,
            className: '',
            label: 'What is the selling price of the house?',
            labelLeft: 'Price',
            placeholder: '1’500’000',
            name: 'price.total',
            formatType: 'price',
            minLengthNum: 0,
            maxLengthNum: 9999999,
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
            minLengthNum: 0,
            maxLengthNum: 999999,
            unit: get(formValue, 'price.currency', 'CHF'),
          },
          {
            component: BrixelRadioButton,
            className: '',
            label: 'Availability of sale',
            name: 'properties.typology.availability',
            options: factsOptions.availability,
          },
          {
            condition: [{
              name: 'properties.typology.availability',
              value: 'other',
            }],
            component: BrixelInputText,
            className: '',
            label: 'What\'s the preferred time of sale?',
            name: 'properties.typology.availabilityText',
            validation: [Validation.markRequired],
          },
        ],
      },
      // STEP 6
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: 'Step 6',
        history: 'step6',
        cardType: 'step6',
        inputs: [
          {
            component: BrixelInputText,
            className: '',
            label: 'Title',
            name: 'title',
          },
          {
            component: BrixelTextArea,
            className: '',
            label: 'What are the highlights of the property?',
            placeholder: 'Add some description about the highlights of your property. Try to think about your potential buyers.',
            name: 'description.highlight',
          },
        ],
      },
      // STEP TO SAVE
      {
        history: 'success',
        toSave: true,
      },
    ];
  }
  return [];
};
