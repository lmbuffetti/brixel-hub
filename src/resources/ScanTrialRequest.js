/* eslint-disable max-len */
import {
  BrixelRadioButton,
  Validation,
} from '@brixel/brixel-components';
import get from 'lodash/get';
import IntroScanFlow from '../Pages/ScanTrialFlow/IntroScanFlow';
import BookTrialFlow from '../Pages/ScanTrialFlow/BookTrialFlow';
import ClipboardImg from '../images/scanTrial/clipboard.png';
import { configureStore } from '../store';
import scanComplete from '../images/Upgrade/upgrade_complete.svg';
import { svgIcons } from './svgIcons';

export const ScanTrialQuestions = () => {
  const formValue = get(configureStore.getState(), 'brixelForm.scanFlow.values', {});
  const isInterested = get(formValue, 'interested', false);

  return [
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
          }],
          name: 'phone',
          validation: [Validation.required],
        },
        {
          condition: [{
            name: 'bookType',
            value: 'online',
          }],
          name: 'date',
          validation: [Validation.required],
        },
        {
          condition: [{
            name: 'bookType',
            value: 'online',
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
      cardType: 'card',
      title: 'Great',
      img: scanComplete,
      subtitle: isInterested ? 'We will work on your feedback.' : 'We will contact as soos as possible',
      history: 'success',
      vCentered: true,
      toSave: true,
      classWrapper: 'fullSize',
    },
    {
      cardType: 'card',
      title: 'Get Prepared',
      img: ClipboardImg,
      subtitle: 'The more we know the better. Please fill out as many facts as possible for preparation.',
      history: 'success',
      vCentered: true,
      toSave: true,
      classWrapper: 'fullSize',
      showExitText: true,
    },
  ];
};
