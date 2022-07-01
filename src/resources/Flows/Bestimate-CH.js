/* eslint-disable max-len */
import {
  BrixelInputStepNumber,
  BrixelInputText,
  Validation,
} from '@brixel/brixel-components/dist/form';
import ResumeBestimate from '../../Pages/Bestimate/ResumeBestimate';

// eslint-disable-next-line default-param-last
export const BestimateCH = (type = null, propertyType) => {
  const bestimate = [
    {
      title: type === 'getStarted' ? `${propertyType !== 'Apartment' ? 'Please tell us some more details' : 'How many bathrooms does the property have?'}` : 'Step 1',
      extraInfo: 'We need some extra information about your property.',
      history: type === 'getStarted' ? `${propertyType !== 'Apartment' ? 'step1' : 'bathrooms'}` : '',
      cardType: 'step1',
      className: type === 'getStarted' ? `${propertyType !== 'Apartment' ? 'bgWhite max-w-fix-544 m-a brdRadius px-2 px-sm-5 py-5' : ''}` : '',
      footerWidth: `${propertyType !== 'Apartment' ? 'max-w-fix-544' : 'max-w-fix-384'}`,
      inputs: [
        {
          component: BrixelInputText,
          condition: [{
            name: 'properties.propertyType',
            noValue: 'Apartment',
          }],
          className: '',
          classBoxWrapper: 'two-cols',
          label: '',
          name: 'properties.typology.lotArea.value',
          type: 'number',
          unit: 'm2',
          minLengthNum: 1,
          maxLengthNum: 99999,
          labelLeft: 'Lot Size',
          placeholder: 'e.g. 140',
          validation: [Validation.required],
        },
        {
          component: BrixelInputStepNumber,
          className: 'two-cols',
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
