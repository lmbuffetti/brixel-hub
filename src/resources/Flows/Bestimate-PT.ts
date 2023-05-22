import {FactsOptions} from '@brixel/brixel-components';
import translateTo from '../../utils/translation';
import {
  BrixelCheckbox,
  BrixelInputQuality,
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelSelect,
  Validation,
} from '@brixel/brixel-components/dist/form';
import ResumeBestimate from '../../Pages/Bestimate/ResumeBestimate';
import homesSvg from '../../images/getstarted/svgs/homes.svg';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

const { factsOptions } = FactsOptions;

export const BestimatePT = (type = null, _propertyType, lang) => {
  const conditionStatus = factsOptions.conditionStatus.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));
  const energyEfficiencyOptions = factsOptions.energyEfficiencyOptions.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));
  const solarOrientation = factsOptions.solarOrientation.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));
  const extraFeatureBestimatePT = factsOptions.extraFeatureBestimatePT.map((item) => ({
    ...item,
    label: translateTo(item.label, lang),
  }));

  const bestimate: QuestionsListType[] = [
    {
      title: translateTo(type === 'getStarted' ? 'Please tell us some more details' : 'Step 1', lang),
      extraInfo: translateTo('We need some extra information about your property.', lang),
      history: 'step1',
      cardType: 'step1',
      className: type === 'getStarted' ? 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5' : '',
      footerWidth: 'max-w-fix-544',
      inputs: [
        {
          className: 'pos-r zIndex6',
          classBoxWrapper: 'two-cols',
          component: BrixelSelect,
          label: translateTo(type === 'getStarted' ? 'Condition' : 'Property condition', lang),
          name: 'properties.building.conditionStatus',
          options: conditionStatus,
          validation: [Validation.required],
        },
        {
          component: BrixelInputText,
          className: '',
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? '' : 'What\'s the gross area of the property?', lang),
          labelLeft: translateTo('Gross area', lang),
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
          label: translateTo(type === 'getStarted' ? '' : 'What\'s the lot size?', lang),
          name: 'properties.typology.lotArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 99999,
          labelLeft: translateTo('Lot Size', lang),
          placeholder: translateTo('e.g. 140', lang),
        },
      ],
    },
    {
      title: translateTo(type === 'getStarted' ? 'Any secondary room?' : 'Step 2', lang),
      className: type === 'getStarted' ? 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5' : '',
      footerWidth: 'max-w-fix-544',
      history: 'step2',
      cardType: 'step2',
      inputs: [
        {
          component: BrixelInputStepNumber,
          className: 'two-cols',
          label: translateTo(type === 'getStarted' ? '' : 'How many bathrooms does the property have?', lang),
          name: 'properties.typology.bathrooms',
          labelLeft: translateTo('Bathrooms', lang),
          step: 1,
          min: 0,
          max: 15,
          placeholder: '0',
          validation: [Validation.maxLengthNumRooms, Validation.markRequired],
        },
        {
          component: BrixelInputText,
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? '' : 'What\'s the surface of the balcony?', lang),
          name: 'properties.typology.balconyArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 9999,
          labelLeft: translateTo('Balcony', lang),
          placeholder: translateTo('e.g. 140', lang),
        },
        {
          component: BrixelInputText,
          className: '',
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? '' : 'What\'s the surface of the terrace?', lang),
          name: 'properties.typology.terraceArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 9999,
          labelLeft: translateTo('Terrace', lang),
          placeholder: translateTo('e.g. 140', lang),
        },
        {
          component: BrixelInputText,
          className: '',
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? '' : 'What\'s the size of the garden?', lang),
          name: 'properties.typology.gardenArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 9999,
          labelLeft: translateTo('Garden', lang),
          placeholder: translateTo('e.g. 140', lang),
        },
      ],
    },
    {
      title: translateTo(type === 'getStarted' ? 'Only a few inputs left.' : 'Step 3', lang),
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
          label: translateTo(type === 'getStarted' ? '' : 'How many garage parking lots belong to the property?', lang),
          name: 'properties.parking.garage',
          labelLeft: translateTo('Garage parking', lang),
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
          label: translateTo(type === 'getStarted' ? '' : 'How many external parking lots belong to the property?', lang),
          name: 'properties.parking.outside',
          labelLeft: translateTo('External parking', lang),
          step: 1,
          min: 0,
          max: 99,
          placeholder: '0',
          validation: [Validation.markRequired],
        },
        {
          component: BrixelInputQuality,
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? 'Energy efficiency' : 'What\'s the energy efficiency of the property?', lang),
          name: 'properties.energy.efficiency',
          options: energyEfficiencyOptions,
        },
        {
          component: BrixelCheckbox,
          classBoxWrapper: 'two-cols mt-5',
          label: translateTo(type === 'getStarted' ? 'Solar orientation' : 'What is the solar orientation?', lang),
          name: 'properties.building.solarOrientarion',
          options: solarOrientation,
        },
      ],
    },
    {
      title: translateTo('Which extra features do you have?', lang),
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
          label: translateTo(type === 'getStarted' ? '' : '', lang),
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
        title: translateTo('Result Page', lang),
        toSave: true,
        vCentered: true,
        subtitle: translateTo('Sales strategy & price', lang),
        history: 'resumeFlow',
        cardType: 'loadComponent',
        component: ResumeBestimate,
      },
    );
  }
  return bestimate;
};
