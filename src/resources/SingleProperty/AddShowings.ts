/**/
import translateTo from '../../utils/translation';
import {BrixelInputPhone, BrixelInputText, BrixelTextArea, Validation} from '@brixel/brixel-components/dist/form';
import ScheduleVisitComponent from '../../Pages/Dashboard/Buyer/ScheduleVisiitComponent';
import scheduleSvg from '../../images/dashboard/scehdule.svg';
import {QuestionsListType} from '@brixel/brixel-components/dist/@types/Model';
import ClipboardImg from '../../images/scanTrial/clipboard.png';

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
        component: BrixelInputPhone,
        classNameBox: 'max-w-fix-816 ml-a mr-a',
        label: translateTo('Phone', lang),
        name: 'phone',
        pdClass: 'py-3 py-md-5',
        type: 'text',
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
    background: 'bgCardGreen',
    hideProgress: true,
    cardType: 'card',
    title: translateTo('Thank you for your request', lang),
    img: ClipboardImg,
    imgMaxWidth: 'max-w-fix-160',
    cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
    subtitle: translateTo('', lang),
    history: 'success',
    vCentered: true,
    toSave: true,
  },
];
