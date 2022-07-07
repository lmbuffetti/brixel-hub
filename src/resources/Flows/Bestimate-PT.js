/* eslint-disable max-len */
import {
  FactsOptions, translateTo,
} from '@brixel/brixel-components';
import {
  BrixelCheckbox,
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelInputQuality,
  Validation,
  BrixelSelect,
} from '@brixel/brixel-components/dist/form';
import ResumeBestimate from '../../Pages/Bestimate/ResumeBestimate';
import homesSvg from '../../images/getstarted/svgs/homes.svg';

const { factsOptions } = FactsOptions;

export const BestimatePT = (type = null) => {
  const conditionStatus = factsOptions.conditionStatus.map((item) => ({
    ...item,
    label: translateTo(item.label)
  }));
  const energyEfficiencyOptions = factsOptions.energyEfficiencyOptions.map((item) => ({
    ...item,
    label: translateTo(item.label)
  }));
  const solarOrientation = factsOptions.solarOrientation.map((item) => ({
    ...item,
    label: translateTo(item.label)
  }));
  const extraFeatureBestimatePT = factsOptions.extraFeatureBestimatePT.map((item) => ({
    ...item,
    label: translateTo(item.label)
  }));
  
  
  const bestimate = [
    {
      title: translateTo(type === 'getStarted' ? 'Please tell us some more details' : 'Step 1'),
      extraInfo: translateTo('We need some extra information about your property.'),
      history: 'step1',
      cardType: 'step1',
      className: type === 'getStarted' ? 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5' : '',
      footerWidth: 'max-w-fix-544',
      inputs: [
        {
          className: 'pos-r zIndex6',
          classBoxWrapper: 'two-cols',
          component: BrixelSelect,
          label: translateTo(type === 'getStarted' ? 'Condition' : 'Property condition'),
          name: 'properties.building.conditionStatus',
          options: conditionStatus,
          validation: [Validation.required],
        },
        {
          component: BrixelInputText,
          className: '',
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? null : 'What\'s the gross area of the property?'),
          labelLeft: translateTo('Gross area'),
          placeholder: '120',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 5000,
          name: 'properties.typology.grossArea.value',
          type: 'number',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputText,
          condition: [{
            name: 'properties.propertyType',
            noValue: 'Apartment',
          }],
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? null : 'What\'s the lot size?'),
          name: 'properties.typology.lotArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 99999,
          labelLeft: translateTo('Lot Size'),
          placeholder: translateTo('e.g. 140'),
        },
      ],
    },
    {
      title: translateTo(type === 'getStarted' ? 'Any secondary room?' : 'Step 2'),
      className: type === 'getStarted' ? 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5' : '',
      footerWidth: 'max-w-fix-544',
      history: 'step2',
      cardType: 'step2',
      inputs: [
        {
          component: BrixelInputStepNumber,
          className: 'two-cols',
          label: translateTo(type === 'getStarted' ? null : 'How many bathrooms does the property have?'),
          name: 'properties.typology.bathrooms',
          labelLeft: translateTo('Bathrooms'),
          step: 1,
          min: 0,
          max: 15,
          placeholder: '0',
          validation: [Validation.maxLengthNumRooms, Validation.markRequired],
        },
        {
          component: BrixelInputText,
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? null : 'What\'s the surface of the balcony?'),
          name: 'properties.typology.balconyArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 9999,
          labelLeft: translateTo('Balcony'),
          placeholder: translateTo('e.g. 140'),
        },
        {
          component: BrixelInputText,
          className: '',
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? null : 'What\'s the surface of the terrace?'),
          name: 'properties.typology.terraceArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 9999,
          labelLeft: translateTo('Terrace'),
          placeholder: translateTo('e.g. 140'),
        },
        {
          component: BrixelInputText,
          className: '',
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? null : 'What\'s the size of the garden?'),
          name: 'properties.typology.gardenArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 9999,
          labelLeft: translateTo('Garden'),
          placeholder: translateTo('e.g. 140'),
        },
      ],
    },
    {
      title: translateTo(type === 'getStarted' ? 'Only a few inputs left.' : 'Step 3'),
      bgImg: homesSvg,
      vCentered: true,
      className: type === 'getStarted' ? 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5' : '',
      footerWidth: 'max-w-fix-544',
      history: 'step3',
      cardType: 'step3',
      inputs: [
        {
          component: BrixelInputStepNumber,
          className: 'two-cols',
          label: translateTo(type === 'getStarted' ? null : 'How many garage parking lots belong to the property?'),
          name: 'properties.parking.garage',
          labelLeft: translateTo('Garage parking'),
          step: 1,
          startFrom: 0,
          min: 0,
          max: 99,
          placeholder: '0',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputStepNumber,
          className: 'two-cols',
          label: translateTo(type === 'getStarted' ? null : 'How many external parking lots belong to the property?'),
          name: 'properties.parking.outside',
          labelLeft: 'External parking',
          step: 1,
          min: 0,
          max: 99,
          placeholder: '0',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputQuality,
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? 'Energy efficiency' : 'What\'s the energy efficiency of the property?'),
          name: 'properties.energy.efficiency',
          options: energyEfficiencyOptions,
        },
        {
          component: BrixelCheckbox,
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? 'Solar orientation' : 'What is the solar orientation?'),
          name: 'properties.building.solarOrientarion',
          options: solarOrientation,
        },
      ],
    },
    {
      title: translateTo('Which extra features do you have?'),
      vCentered: true,
      history: 'step4',
      className: type === 'getStarted' ? 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5' : '',
      footerWidth: 'max-w-fix-544',
      cardType: 'step4',
      inputs: [
        {
          classNameParent: 'extraCols',
          className: 'extraFeature',
          component: BrixelCheckbox,
          icons: false,
          label: translateTo(type === 'getStarted' ? null : ''),
          name: 'properties.extraFeaturesBestimatePT',
          pdClass: 'p-1',
          iconClass: 'p-small-17 fSizePx22 bgPrimary400 txtWhite brdRadius mr-1',
          options: extraFeatureBestimatePT,
        },
      ],
    },
  ];
  if (type !== 'getStarted') {
    bestimate.push(
      {
        title: translateTo('Result Page'),
        toSave: true,
        vCentered: true,
        subtitle: translateTo('Sales strategy & price'),
        history: 'resumeFlow',
        cardType: 'loadComponent',
        component: ResumeBestimate,
      },
    );
  }
  return bestimate;
};
