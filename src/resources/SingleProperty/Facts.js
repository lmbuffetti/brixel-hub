/* eslint-disable max-len */
import get from 'lodash/get';
import { FactsOptions } from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
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

export const FactsApartment = (lang) => {
  const formValue = get(configureStore.getState(), 'brixelForm.GamingFlow.values', {});
  
  const typeFlatCode = factsOptions.typeFlatCode.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const quality = factsOptions.quality.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const BrixelExtraFeatureFacts = factsOptions.BrixelExtraFeature.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const isPropertyRenovatedOptions = factsOptions.isPropertyRenovatedOptions.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const heating = factsOptions.heating.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const availability = factsOptions.availability.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  const typeHouseCode = factsOptions.typeHouseCode.map((item) => ({
    ...item,
    label: translateTo(item.label, lang)
  }));
  
  
  if (get(formValue, 'properties.propertyType', null) === 'Apartment') {
    return [
      // SECTION: PROPERTY TYPE APARTMENT
      // STEP 1
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: translateTo('Step 1', lang),
        history: 'step1',
        cardType: 'step1',
        inputs: [
          {
            component: BrixelRadioButton,
            className: '',
            label: translateTo('What\'s the type of the apartment?', lang),
            name: 'properties.building.typeFlatCode',
            options: typeFlatCode,
          },
          {
            component: BrixelInputStepNumber,
            className: '',
            label: translateTo('How many bathrooms does the property have?', lang),
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
            label: translateTo('How is the condition of the apartment?', lang),
            name: 'properties.building.apartmentQuality',
            options: quality,
          },
        ],
      },
      // STEP 2
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: translateTo('Step 2', lang),
        history: 'step2',
        cardType: 'step2',
        inputs: [
          {
            component: BrixelExtraFeature,
            className: '',
            label: translateTo('Extra features', lang),
            name: 'properties.extraFeatures',
            options: BrixelExtraFeatureFacts,
          },
        ],
      },
      // STEP 3
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: translateTo('Step 3', lang),
        history: 'step3',
        cardType: 'step3',
        inputs: [
          {
            component: BrixelRadioButton,
            className: 'helpLink',
            label: translateTo('Is the property renovated?', lang),
            name: 'properties.building.isPropertyRenovated',
            options: isPropertyRenovatedOptions,
          },
          {
            condition: [{
              name: 'properties.building.isPropertyRenovated',
              value: 1,
            }],
            component: BrixelInputText,
            className: '',
            label: translateTo('If yes, when was the property last time renovated?', lang),
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
            label: translateTo('What\'s the surface of the balcony?', lang),
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
            label: translateTo('What\'s the size of the garden?', lang),
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
        title: translateTo('Step 4', lang),
        history: 'step4',
        cardType: 'step4',
        inputs: [
          {
            component: BrixelInputStepNumber,
            className: '',
            label: translateTo('How many garage parking lots belong to the property?', lang),
            name: 'properties.parking.garage',
            labelLeft: 'Garage parking',
            step: 1,
            placeholder: '0',
          },
          {
            component: BrixelInputStepNumber,
            className: '',
            placeholder: '0',
            label: translateTo('How many external parking lots belong to the property?', lang),
            name: 'properties.parking.outside',
            labelLeft: 'External parking',
            step: 1,
          },
          {
            component: BrixelInputStepNumber,
            className: '',
            label: translateTo('How many underground parking lots belong to the property?', lang),
            labelLeft: 'Underground parking',
            name: 'properties.parking.underground',
            step: 1,
            placeholder: '0',
          },
          {
            component: BrixelCheckbox,
            className: 'mb-2',
            label: translateTo('What\'s the heating system?', lang),
            name: 'properties.energy.heating',
            options: heating,
          },
        ],
      },
      // STEP 5
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: translateTo('Step 5', lang),
        history: 'step5',
        cardType: 'step5',
        inputs: [
          {
            component: BrixelInputText,
            className: '',
            label: translateTo('What is the selling price of the house?', lang),
            labelLeft: 'Price',
            placeholder: '1’500’000',
            name: 'price.total',
            formatType: 'price',
            unit: get(formValue, 'price.currency', 'CHF'),
          },
          {
            component: BrixelInputText,
            className: '',
            label: translateTo('What are the additional costs per year?', lang),
            placeholder: '7400',
            name: 'properties.building.maintenanceCost',
            labelLeft: 'Additional costs',
            formatType: 'price',
            unit: get(formValue, 'price.currency', 'CHF'),
          },
          {
            component: BrixelRadioButton,
            className: '',
            label: translateTo('Availability of sale', lang),
            name: 'properties.typology.availability',
            options: availability,
          },
          {
            condition: [{
              name: 'properties.typology.availability',
              value: 'other',
            }],
            component: BrixelInputText,
            className: '',
            label: translateTo('What\'s the preferred time of sale?', lang),
            name: 'properties.typology.availabilityText',
            validation: [Validation.markRequired],
          },
        ],
      },
      // STEP 6
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: translateTo('Step 6', lang),
        history: 'step6',
        cardType: 'step6',
        inputs: [
          {
            component: BrixelInputText,
            className: '',
            label: translateTo('Title', lang),
            name: 'title',
          },
          {
            component: BrixelTextArea,
            className: '',
            label: translateTo('What are the highlights of the property?', lang),
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
        title: translateTo('Step 1', lang),
        history: 'step1',
        cardType: 'step1',
        inputs: [

          {
            component: BrixelRadioButton,
            className: '',
            label: translateTo('What\'s the type of the house?', lang),
            name: 'properties.building.typeHouseCode',
            options: typeHouseCode,
          },
          {
            component: BrixelInputStepNumber,
            className: '',
            label: translateTo('How many bathrooms does the property have?', lang),
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
            label: translateTo('What\'s the lot size?', lang),
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
            label: translateTo('What\'s the house\'s volume?', lang),
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
            label: translateTo('In which condition is the property?', lang),
            name: 'properties.building.conditionCode',
            options: quality,
          },
        ],
      },
      // STEP 2
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: translateTo('Step 2', lang),
        history: 'step2',
        cardType: 'step2',
        inputs: [
          {
            component: BrixelExtraFeature,
            className: '',
            label: translateTo('Extra features', lang),
            name: 'properties.extraFeatures',
            options: BrixelExtraFeatureFacts,
          },
        ],
      },
      // STEP 3
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: translateTo('Step 3', lang),
        history: 'step3',
        cardType: 'step3',
        inputs: [
          {
            component: BrixelRadioButton,
            className: 'helpLink',
            label: translateTo('Is the property renovated?', lang),
            name: 'properties.building.isPropertyRenovated',
            options: isPropertyRenovatedOptions,
          },
          {
            condition: [{
              name: 'properties.building.isPropertyRenovated',
              value: 1,
            }],
            component: BrixelInputText,
            className: '',
            label: translateTo('If yes, when was the property last time renovated?', lang),
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
            label: translateTo('What\'s the surface of the balcony?', lang),
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
            label: translateTo('What\'s the size of the garden?', lang),
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
            label: translateTo('What\'s the size of the attic?', lang),
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
        title: translateTo('Step 4', lang),
        history: 'step4',
        cardType: 'step4',
        inputs: [
          {
            component: BrixelCheckbox,
            className: 'mb-2',
            label: translateTo('What\'s the heating system?', lang),
            name: 'properties.energy.heating',
            options: heating,
          },
        ],
      },
      // STEP 5
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: translateTo('Step 5', lang),
        history: 'step5',
        cardType: 'step5',
        inputs: [
          {
            component: BrixelInputText,
            className: '',
            label: translateTo('What is the selling price of the house?', lang),
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
            label: translateTo('What are the additional costs per year?', lang),
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
            label: translateTo('Availability of sale', lang),
            name: 'properties.typology.availability',
            options: availability,
          },
          {
            condition: [{
              name: 'properties.typology.availability',
              value: 'other',
            }],
            component: BrixelInputText,
            className: '',
            label: translateTo('What\'s the preferred time of sale?', lang),
            name: 'properties.typology.availabilityText',
            validation: [Validation.markRequired],
          },
        ],
      },
      // STEP 6
      {
        className: 'radioBtnImg',
        group: 'Type',
        title: translateTo('Step 6', lang),
        history: 'step6',
        cardType: 'step6',
        inputs: [
          {
            component: BrixelInputText,
            className: '',
            label: translateTo('Title', lang),
            name: 'title',
          },
          {
            component: BrixelTextArea,
            className: '',
            label: translateTo('What are the highlights of the property?', lang),
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
