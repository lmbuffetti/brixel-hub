/* eslint-disable max-len */
import {
  BrixelInputText,
  BrixelTextArea,
  BrixelInputDatePicker,
  Validation,
} from '@brixel/brixel-components/dist/form';

export const QuestionsList = () => [
  {
    title: 'Schedule a visit to your future home',
    history: 'visitDates',
    className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5',
    inputs: [
      {
        component: BrixelInputDatePicker,
        className: '',
        classNameBox: 'ml-a mr-a',
        classBoxWrapper: 'mt-2',
        ReduxFieldClass: '',
        label: 'Choose your date',
        name: 'visitDates',
        showFullSelectDate: true,
        large: true,
        hasButtonChoice: true,
        validation: [Validation.required],
      },
    ],
  },
  {
    title: 'How can we reach you?',
    history: 'contactInfo',
    className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdAltGrey100 p-2 p-sm-5',
    inputs: [
      {
        component: BrixelInputText,
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        label: 'Name',
        name: 'name',
        validation: [Validation.required],
        pdClass: 'py-3 py-md-5',
      },
      {
        component: BrixelInputText,
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        label: 'Phone',
        name: 'phone',
        pdClass: 'py-3 py-md-5',
        type: 'text',
        formatType: 'tel',
        validation: [Validation.phoneIfNotEmptyLength, Validation.required],
      },
      {
        component: BrixelInputText,
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        label: 'Email',
        name: 'email',
        validation: [Validation.isEmail, Validation.required],
        pdClass: 'py-3 py-md-5',
      },
      {
        component: BrixelTextArea,
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        label: 'Message',
        name: 'message',
        pdClass: 'py-3 py-md-5',
      },
    ],
  },
  {
    title: 'Thank you for scheduling your visits',
    history: 'success',
    toSave: true,
  },
];
