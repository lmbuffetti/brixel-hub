/* eslint-disable max-len */
import translateTo from '../../utils/translation';
import { BrixelInputStepNumber, BrixelInputText, Validation } from '@brixel-io/brixel-components/dist/form';
import ResumeBestimate from '../../Pages/Bestimate/ResumeBestimate';
// eslint-disable-next-line default-param-last
export const BestimateCH = (type = null, propertyType, lang) => {
    const bestimate = [
        {
            title: translateTo(type === 'getStarted' ? `${propertyType !== 'Apartment' ? 'Please tell us some more details' : 'How many bathrooms does the property have?'}` : 'Step 1', lang),
            extraInfo: translateTo('We need some extra information about your property.', lang),
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
                    labelLeft: translateTo('Lot Size', lang),
                    placeholder: 'e.g. 140',
                    validation: [Validation.required],
                },
                {
                    component: BrixelInputStepNumber,
                    className: 'two-cols',
                    label: translateTo(type === 'getStarted' ? '' : 'How many bathrooms does the property have?', lang),
                    name: 'properties.typology.bathrooms',
                    labelLeft: translateTo(`${type === 'getStarted' ? `${propertyType !== 'Apartment' ? 'Bathrooms' : ''}` : 'Bathrooms'}`, lang),
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
        bestimate.push({
            title: translateTo('Result Page', lang),
            toSave: true,
            vCentered: true,
            subtitle: translateTo('Sales strategy & price', lang),
            history: 'resumeFlow',
            cardType: 'loadComponent',
            component: ResumeBestimate,
        });
    }
    return bestimate;
};
