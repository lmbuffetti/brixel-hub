/* eslint-disable max-len */
import {
  BrixelRadioButton,
  Validation,
} from '@brixel/brixel-components';
import IntroScanFlow from '../Pages/ScanTrialFlow/IntroScanFlow';
import BookTrialFlow from '../Pages/ScanTrialFlow/BookTrialFlow';
import ResumeTrialFlow from '../Pages/ScanTrialFlow/ResumeTrialFlow';
import ClipboardImg from '../images/scanTrial/clipboard.png';
import { svgIcons } from './svgIcons';

export const ScanTrialQuestions = () => [
  {
    cardType: 'loadComponent',
    history: 'servicePackage',
    component: IntroScanFlow,
  },
  {
    title: 'How do you want to do the analysis?',
    history: 'analysis',
    vCentered: true,
    inputs: [{
      component: BrixelRadioButton,
      className: 'radioBtnImg',
      ReduxFieldClass: '',
      label: '',
      name: 'analysis',
      validation: [Validation.required],
      icons: true,
      cardLayout: true,
      svgSupport: true,
      pdClass: '',
      isHorizontal: true,
      options: [
        {
          title: 'On-site',
          label: 'We visit you to evaluate your property.\n',
          value: 'on-site',
          img: svgIcons.onSite,
          color: 'blue',
        },
        {
          title: 'Remote',
          label: 'We get to know you and your property in a call.',
          value: 'remote',
          img: svgIcons.remote,
          color: 'green',
        },
      ],
    }],
  },
  {
    cardType: 'loadComponent',
    history: 'BookTrialFlow',
    component: BookTrialFlow,
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
    background: 'bgGreen200',
    cardType: 'loadComponent',
    component: ResumeTrialFlow,
    history: 'resume',
    vCentered: true,
    toSave: true,
    classWrapper: 'fullSize',
  },
  {
    conditions: [{
      name: 'bookType',
      value: 'whereby',
    }],
    step: 'wherebyResume',
    background: 'bgGreen200',
    cardType: 'loadComponent',
    component: ResumeTrialFlow,
    history: 'whereby',
    vCentered: true,
    toSave: true,
    classWrapper: 'fullSize',
  },
  {
    cardType: 'card',
    title: 'Get Prepared',
    img: ClipboardImg,
    imgMaxWidth: 'max-w-fix-160',
    cardClass: 'max-w-fix-360 ml-a mr-a',
    subtitle: 'The more we know the better. Please fill out as many facts as possible for preparation.',
    history: 'success',
    vCentered: true,
    classWrapper: 'fullSize',
    showExitText: true,
  },
];
