/**/
import translateTo from '../../utils/translation';
import {BrixelInputText, BrixelTextArea, Validation} from '@brixel/brixel-components/dist/form';
import ScheduleVisitComponent from '../../Pages/Dashboard/Buyer/ScheduleVisiitComponent';
import scheduleSvg from '../../images/dashboard/scehdule.svg';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';

export const QuestionsList: (lang: string) => QuestionsListType[] = (lang) => [
  {
    titleIcon: scheduleSvg,
    title: translateTo('Request a visit to your future home', lang),
    history: 'visitDates',
    classNameWrapper: 'max-w-fix-600 ml-a mr-a p-2 p-sm-5',
    component: ScheduleVisitComponent,
    cardType: 'loadComponent',
    hideFooter: true,
  },
  {
    title: translateTo('How can we reach you?', lang),
    history: 'contactInfo',
    className: 'bgWhite max-w-fix-600 ml-a mr-a p-2 p-sm-5',
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
    className: 'max-w-fix-600 ml-a mr-a brdRadius bgWhite brdSmall brdText50 p-2 p-sm-5',
    history: 'success',
    toSave: true,
  },
];
