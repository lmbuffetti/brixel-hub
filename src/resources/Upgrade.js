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

export const UpgradeQuestions = (lang, packagesProperty, location = {}) => {
  const optionsPackages = [];
  if (packagesProperty) {
    packagesProperty.map((item) => {
      optionsPackages.push({
        color: item.stub.includes('premium') ? 'Red400' : 'Green400',
        label: item.name,
        description: item.description,
        img: item.stub.includes('premium') ? brixelPremium : brixelPlus,
        priceInfo: `Flat  ${item.price.currency} ${item.price.total}`,
        value: item.id,
        moreDetails: item.details
      });
      return null;
    });
  }
  let price = 'CHF 26\'000';
  if (location.countryCode === 'CH') price = 'CHF 26\'000';
  if (location.countryCode === 'PT') price = 'EUR 12\'000';
  console.log(location)
  return [
    {
      title: translateTo(lang,"Do you want to upgrade?"),
      subtitle: `<span class="txtGreen400">Save ${price}</span> on average compared to traditional agents.`,
      history: 'servicePackage',
      inputs: [
        {
          component: BrixelCheckboxWithDetail,
          pdClass: 'py-2 py-md-3 px-1',
          label: '',
          name: "packageUpgrade.servicePackage",
          validation: [Validation.required],
          options: optionsPackages,
        },
      ],
    },
    {
      title: translateTo(lang,"When do you want to start?"),
      subtitle: "This helps me planing your journey.",
      history: 'wantToStart',
      vCentered: true,
      inputs: [
        {
          component: BrixelRadioButton,
          pdClass: 'py-2 py-md-3 px-1',
          icons: true,
          label: '',
          name: "packageUpgrade.whenToStart",
          validation: [Validation.required],
          options: [
            {
              label: 'Yesterday ;-)',
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
      title: translateTo(lang,"Is the property currently inhabited?"),
      subtitle: "",
      vCentered: true,
      history: 'propertyInhabited',
      inputs: [
        {
          component: BrixelRadioButton,
          pdClass: 'py-2 py-md-3 px-1',
          label: '',
          icons: true,
          name: "packageUpgrade.propertyInhabited",
          validation: [Validation.booleanRequired],
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
            name: "packageUpgrade.propertyInhabited",
            value: true,
          }],
          component: BrixelRadioButton,
          pdClass: 'py-2 py-md-3 px-1',
          icons: true,
          title: 'Are you currently living there?',
          name: "packageUpgrade.livingThere",
          validation: [Validation.booleanRequired],
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
      title: translateTo(lang,"How can I reach you best?"),
      subtitle: "",
      vCentered: true,
      history: 'contactDetails',
      inputs: [
        {
          component: BrixelCheckbox,
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
          title: 'Are this your correct contact informations?',
          component: BrixelInputText,
          classNameBox: 'bgLight100 p-1',
          label: 'Phone number',
          name: "packageUpgrade.contactPhone",
          placeholder: '+41 78 852 58 76',
          validation: [Validation.required],
        },
        {
          component: BrixelInputText,
          classNameBox: 'bgLight100 p-1 mb-2',
          label: 'E-mail',
          name: "packageUpgrade.contactEmail",
          placeholder: 'hans.muster@amazon.com',
          validation: [Validation.isEmail, Validation.required],
        },
        {
          title: 'When is the best time to contact you?',
          component: BrixelCheckbox,
          pdClass: 'py-2 py-md-3 px-1',
          icons: true,
          label: '',
          name: "packageUpgrade.contactTime",
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
      title: translateTo(lang,"Great. Your order is complete. "),
      subtitle: "We will reach out to you to organise the further steps and clarify all your questions.",
      history: 'upgradeType',
      img: upgradeComplete,
      vCentered: true,
      toSave: true,
    },
  ];
}
