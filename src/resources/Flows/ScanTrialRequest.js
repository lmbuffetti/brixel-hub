/* eslint-disable max-len */
import { translateTo } from '@brixel/brixel-components';
import {
  BrixelRadioButton,
  BrixelInputText,
  Validation,
} from '@brixel/brixel-components/dist/form';
import IntroScanFlow from '../../Pages/ContactFlow/ScanTrial/IntroScanFlow';
import BookTrialFlow from '../../Pages/ContactFlow/ScanTrial/BookTrialFlow';
import ResumeTrialFlow from '../../Pages/ContactFlow/ScanTrial/ResumeTrialFlow';
import ClipboardImg from '../../images/scanTrial/clipboard.png';
import { svgIcons } from '../Utilities/svgIcons';

export const ScanTrialQuestions = (lang) => [
  {
    cardType: 'loadComponent',
    history: 'introScanTrial',
    component: IntroScanFlow,
    hideProgress: true,
  },
  {
    conditions: [{
      name: 'userID',
      value: null,
    }],
    title: translateTo('Nice to meet you. Who are you?', lang),
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
        label: translateTo('Email', lang),
        name: 'email',
        validation: [Validation.isEmail, Validation.required],
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
    ],
  },
  {
    conditions: [{
      name: 'userID',
      value: null,
    }],
    title: translateTo('How do you want to do the analysis?', lang),
    history: 'analysis',
    inputs: [{
      component: BrixelRadioButton,
      className: '',
      classNameBox: 'max-w-fix-816 ml-a mr-a',
      ReduxFieldClass: '',
      label: '',
      name: 'analysis',
      validation: [Validation.required],
      icons: true,
      cardLayout: true,
      svgWidth: 'max-w-fix-96 max-w-fix-sm-192',
      stretched: true,
      pdClass: 'py-2 py-sm-5',
      svgSupport: true,
      isHorizontal: true,
      options: [
        {
          title: translateTo('On-site', lang),
          label: translateTo('We visit you to evaluate your property.', lang),
          value: 'on-site',
          img: svgIcons.onSite,
          color: 'blue',
        },
        {
          title: translateTo('Remote', lang),
          label: translateTo('We get to know you and your property in a call.', lang),
          value: 'remote',
          img: svgIcons.remote,
          color: 'green',
        },
      ],
    }],
  },
  {
    cardType: 'loadComponent',
    history: 'BookScanTrial',
    component: BookTrialFlow,
    footerWidth: 'max-w-fix-600',
    inputs: [
      {
        condition: [{
          name: 'bookType',
          value: 'online',
        },
        {
          name: 'bookType',
          value: 'schedule',
        }],
        name: 'phone',
      },
      {
        condition: [{
          name: 'bookType',
          value: 'online',
        },
        {
          name: 'bookType',
          value: 'schedule',
        }],
        name: 'dateBook',
        validation: [Validation.required],
      },
      {
        condition: [{
          name: 'bookType',
          value: 'online',
        },
        {
          name: 'bookType',
          value: 'schedule',
        }],
        name: 'hourBook',
        validation: [Validation.required],
      },
    ],
  },
  {
    conditions: [{
      name: 'step',
      noValue: 'skip',
    }],
    hideProgress: true,
    background: 'bgCardGreen',
    cardType: 'loadComponent',
    component: ResumeTrialFlow,
    history: 'resume',
    vCentered: true,
    toSave: true,
    classWrapper: '',
  },
  {
    hideProgress: true,
    conditions: [{
      name: 'bookType',
      value: 'whereby',
    }],
    step: 'wherebyResume',
    background: 'bgCardGreen',
    cardType: 'loadComponent',
    component: ResumeTrialFlow,
    history: 'whereby',
    vCentered: true,
    classWrapper: '',
  },
  {
    hideProgress: true,
    cardType: 'card',
    title: translateTo('Get Prepared', lang),
    img: ClipboardImg,
    imgMaxWidth: 'max-w-fix-160',
    cardClass: 'max-w-fix-360 ml-a mr-a pb-5',
    subtitle: translateTo('The more we know the better. Please fill out as many facts as possible for preparation.', lang),
    history: 'success',
    vCentered: true,
    classWrapper: '',
    showExitText: true,
  },
];
