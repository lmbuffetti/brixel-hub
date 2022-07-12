/* eslint-disable max-len */
import { translateTo } from '@brixel/brixel-components';
import {
  BrixelInputText,
  BrixelTextArea,
  BrixelInputDatePicker,
  Validation,
} from '@brixel/brixel-components/dist/form';

export const QuestionsList = (lang) => [
  {
    title: translateTo('Request a visit to your future home', lang),
    history: 'visitDates',
    className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5',
    inputs: [
      {
        component: BrixelInputDatePicker,
        className: '',
        classNameBox: 'ml-a mr-a',
        classBoxWrapper: 'mt-2',
        ReduxFieldClass: '',
        label: translateTo('Choose your date', lang),
        name: 'visitDates',
        showFullSelectDate: true,
        large: true,
        hasButtonChoice: true,
        validation: [Validation.required],
      },
    ],
  },
  {
    title: translateTo('How can we reach you?', lang),
    history: 'contactInfo',
    className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5',
    inputs: [
      {
        component: BrixelInputText,
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        label: translateTo('Name', lang),
        name: 'name',
        validation: [Validation.required],
        pdClass: 'py-3 py-md-5',
      },
      {
        component: BrixelInputText,
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        label: translateTo('Phone', lang),
        name: 'phone',
        pdClass: 'py-3 py-md-5',
        type: 'text',
        formatType: 'tel',
        validation: [Validation.phoneIfNotEmptyLength, Validation.required],
      },
      {
        component: BrixelInputText,
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        label: translateTo('Email', lang),
        name: 'email',
        validation: [Validation.isEmail, Validation.required],
        pdClass: 'py-3 py-md-5',
      },
      {
        component: BrixelTextArea,
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        label: translateTo('Message', lang),
        name: 'message',
        pdClass: 'py-3 py-md-5',
      },
    ],
  },
  {
    title: translateTo('Thank you for your request', lang),
    className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5',
    history: 'success',
    toSave: true,
    inputs: [],
  },
];
