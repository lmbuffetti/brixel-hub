/* eslint-disable max-len */
import {
  BrixelInputStepNumber,
  BrixelInputText,
  BrixelExtraFeature,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeBestimate from '../Pages/GameHistory/Bestimate/ResumeBestimate';
import homesSvg from '../images/getstarted/svgs/homes.svg';

const { factsOptions } = FactsOptions;

export const BestimateCH = (type = null, propertyType) => {
  const bestimate = [
    {
      title: type === 'getStarted' ? `${propertyType !== 'Apartment' ? 'Please tell us some more details' : 'How many bathrooms does the property have?'}` : 'Step 1',
      extraInfo: 'We need some extra information about your property.',
      history: type === 'getStarted' ? `${propertyType !== 'Apartment' ? 'step1' : 'bathrooms'}` : '',
      cardType: 'step1',
      className: type === 'getStarted' ? `${propertyType !== 'Apartment' ? 'bgWhite max-w-fix-600 m-a brdRadius px-2 px-sm-5 py-5' : ''}` : '',
      footerWidth: `${propertyType !== 'Apartment' ? 'max-w-fix-600' : 'max-w-fix-384'}`,
      inputs: [
        {
          component: BrixelInputText,
          condition: [{
            name: 'properties.propertyType',
            noValue: 'Apartment',
          }],
          className: '',
          label: 'What\'s the lot size?',
          name: 'properties.typology.lotArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLenghtNum: 99999,
          labelLeft: 'Lot Size',
          placeholder: 'e.g. 140',
          validation: [Validation.required],
        },
        {
          component: BrixelInputStepNumber,
          className: 'className',
          label: type === 'getStarted' ? null : 'How many bathrooms does the property have?',
          name: 'properties.typology.bathrooms',
          labelLeft: `${type === 'getStarted' ? `${propertyType !== 'Apartment' ? 'Bathrooms' : ''}` : 'Bathrooms'}`,
          step: 1,
          classNameBox: `${type === 'getStarted' ? `${propertyType !== 'Apartment' ? '' : 'max-w-fix-384 w-perc-100 fieldHolder bgWhite brdRadius px-2 px-sm-5 py-5 m-a'}` : ''}`,
          min: 0,
          max: 15,
          fluid: type === 'getStarted' ? propertyType === 'Apartment' : null,
          placeholder: '0',
          validation: [Validation.maxLengthNumRooms, Validation.markRequired],
        },
      ],
    },
    {
      title: 'Which extra features do you have?',
      vCentered: true,
      history: 'step3',
      cardType: 'step3',
      bgImg: homesSvg,
      className: type === 'getStarted' ? 'bgWhite max-w-fix-600 m-a brdRadius px-2 px-sm-5 py-5' : '',
      footerWidth: 'max-w-fix-600',
      inputs: [
        {
          component: BrixelExtraFeature,
          label: 'Extra features',
          name: 'properties.extraFeatures',
          pdClass: 'p-1 bgLight100',
          className: 'extraFeature',
          iconClass: 'p-small-10 bgPrimary100 txtWhite brdRadius mr-1',
          options: factsOptions.BrixelExtraFeature,
        },
      ],
    },
  ];
  if (type !== 'getStarted') {
    bestimate.push(
      {
        title: 'Result Page',
        toSave: true,
        vCentered: true,
        subtitle: 'Sales strategy & price',
        history: 'resumeFlow',
        cardType: 'loadComponent',
        component: ResumeBestimate,
      },
    );
  }
  return bestimate;
};
