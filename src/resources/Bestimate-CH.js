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

export const BestimateCH = (type = null) => {
  const bestimate = [
    {
      title: type === 'getStarted' ? 'Please tell us some more details' : 'Step 1',
      extraInfo: 'We need some extra information about your property.',
      history: 'step1',
      cardType: 'step1',
      className: type === 'getStarted' ? 'bgWhite max-w-fix-600 m-a brdRadius py-5 px-6' : '',
      bgImg: homesSvg,
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
          className: '',
          label: type === 'getStarted' ? null : 'How many bathrooms does the property have?',
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
      title: 'Which extra features do you have?',
      vCentered: true,
      history: 'step3',
      cardType: 'step3',
      bgImg: homesSvg,
      className: type === 'getStarted' ? 'bgWhite max-w-fix-600 m-a brdRadius py-5 px-6' : '',
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
