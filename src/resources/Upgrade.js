/* eslint-disable max-len */
import {
  BrixelCheckbox,
  BrixelRadioButton,
  BrixelInputText,
  Validation,
} from '@brixel/brixel-components';
import BrixelCheckboxWithDetail from '../components/BrixelCheckboxWithDetail';
import { translateTo } from '../utils/translation';
import brixelPlus from '../images/Upgrade/brixel_plus.svg';
import brixelPremium from '../images/Upgrade/brixel_premium.svg';
import upgradeComplete from '../images/Upgrade/upgrade_complete.svg';

export const UpgradeQuestions = (lang) => [
  {
    title: translateTo(lang,"Do you want to upgrade?"),
    subtitle: "Here are my options for you",
    history: 'upgradeType',
    vCentered: true,
    toSave: true,
    inputs: [
      {
        component: BrixelCheckboxWithDetail,
        pdClass: 'py-2 py-md-3 px-1',
        label: '',
        name: "upgradeType",
        validation: [Validation.required],
        options: [
          {
            color: 'Red400',
            label: 'Brixel Premium',
            description: 'Hand over the marketing part. We take care of everything from photos to the schedule of your showings.',
            img: brixelPremium,
            priceInfo: 'Flat  CHF 3’900',
            value: 'premium',
            moreDetails: [
              'Professional hedonic estimation',
              'Photos, 3D tour and floors plans',
              'Selling brochure',
              'Personal property website',
              '6 months of listings on Homegate & Immoscout',
              'Management of all requests',
            ]
          },
          {
            color: 'Green400',
            label: 'Brixel Plus',
            description: 'Are you tired of the paperwork? Let\'s do the legal part together all the way to the notary.',
            priceInfo: 'Flat  CHF 3’600',
            img: brixelPlus,
            value: 'plus',
            moreDetails: [
              'Review of all offers',
              'Solvency check of potential buyers',
              'Coordination with the notary',
              'Neutral check of the deed of sale',
              'Support for legal and tax issues',
            ],
          }
        ]
      },
    ],
  },
  {
    condition: [{
      name: 'upgradeType',
      value: null,
    }],
    title: translateTo(lang,"When do you want to start?"),
    subtitle: "This helps me planing your journey.",
    history: 'wantToStart',
    vCentered: true,
    toSave: true,
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-md-3 px-1',
        icons: true,
        label: '',
        name: "wantsStart",
        validation: [Validation.required],
        options: [
          {
            label: 'Yesterday',
            value: 'yesterday',
          },
          {
            label: 'Within the next 2 weeks',
            value: 'within-2-weeks',
          },
          {
            label: 'Within the next 2 months',
            value: 'within-2-months',
          },
          {
            label: 'Later',
            value: 'later',
          },
        ]
      },
    ],
  },
  {
    condition: [
      {
        name: 'upgradeType[0]',
        value: 'premium',
      },
      {
        name: 'upgradeType[1]',
        value: null,
      }
    ],
    title: translateTo(lang,"Is the property currently inhabited?"),
    subtitle: "",
    history: 'propertyInhabited',
    vCentered: true,
    toSave: true,
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-md-3 px-1',
        icons: true,
        label: '',
        name: "propertyInhabited",
        validation: [Validation.required],
        options: [
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ]
      },
      {
        condition: [{
          name: "propertyInhabited",
          value: true,
        }],
        component: BrixelRadioButton,
        pdClass: 'py-2 py-md-3 px-1',
        icons: true,
        label: 'Are you currently living there?',
        name: "livingThere",
        validation: [Validation.required],
        options: [
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No, someone else',
            value: false,
          },
        ]
      },
    ],
  },
  {
    condition: [
      {
        name: 'upgradeType[0]',
        value: 'plus',
      },
      {
        name: 'upgradeType[1]',
        value: null,
      }
    ],
    title: translateTo(lang,"How can I reach you best?"),
    subtitle: "",
    history: 'propertyInhabited',
    vCentered: true,
    toSave: true,
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-md-3 px-1',
        icons: true,
        label: '',
        name: "contactPreference",
        validation: [Validation.required],
        options: [
          {
            label: 'Via Phone',
            value: 'phone',
          },
          {
            label: 'Via Whatsapp',
            value: 'whatsapp',
          },
          {
            label: 'Via E-Mail',
            value: 'email',
          },
        ]
      },
      {
        component: BrixelInputText,
        pdClass: 'py-2 py-md-3 px-1',
        icons: true,
        label: 'Phone number',
        name: "contactPhone",
        placeholder: '+41 78 852 58 76',
        validation: [Validation.required],
      },
      {
        component: BrixelInputText,
        pdClass: 'py-2 py-md-3 px-1',
        icons: true,
        label: 'E-mail',
        name: "contactEmail",
        placeholder: 'hans.muster@amazon.com',
        validation: [Validation.required],
      },
      {
        component: BrixelCheckbox,
        pdClass: 'py-2 py-md-3 px-1',
        icons: true,
        label: '',
        name: "contactTime",
        validation: [Validation.required],
        options: [
          {
            label: 'In the morning',
            value: 'morning',
          },
          {
            label: 'In the afternoon',
            value: 'afternoon',
          },
          {
            label: 'In the evening',
            value: 'evening',
          },
        ]
      },
    ],
  },
  {
    condition: [
      {
        name: 'upgradeType[0]',
        value: 'plus',
      },
      {
        name: 'upgradeType[1]',
        value: 'premium',
      }
    ],
    title: translateTo(lang,"Is the property currently inhabited?"),
    subtitle: "",
    history: 'propertyInhabited',
    vCentered: true,
    toSave: true,
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-md-3 px-1',
        icons: true,
        label: '',
        name: "propertyInhabited",
        validation: [Validation.required],
        options: [
          {
            label: 'Yes',
            value: true,
          },
          {
            label: 'No',
            value: false,
          },
        ]
      },
    ],
  },
  {
    title: translateTo(lang,"Great. Your order is complete. "),
    subtitle: "We will reach out to you to organise the further steps and clarify all your questions.",
    history: 'upgradeType',
    img: upgradeComplete,
    vCentered: true,
    toSave: true,
  },
];
