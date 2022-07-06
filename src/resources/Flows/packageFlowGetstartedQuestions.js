import { BrixelRadioButton, Validation } from '@brixel/brixel-components/dist/form';
import { translateTo } from '@brixel/brixel-components';
import brixelComingTown from '../../images/BrxielComingTown/secondAwards.svg';

export const PackageFlow = (lang) => [
  {
    conditions: [{
      name: 'signup',
      value: true,
    }],
    title: translateTo(lang, 'Welcome to the home of your home.'),
    subtitle: translateTo(lang, 'You earned the <span class=txtGreen400>"Newcomer"</span> Award and +100 Brixels.'),
    history: 'rewardsStep',
    cardType: 'RewardsStep',
    background: 'bgBlue100',
    img: brixelComingTown,
  },
  {
    title: translateTo(lang, 'What do you need the market check for?'),
    component: BrixelRadioButton,
    history: 'ownerType',
    inputs: [
      {
        label: '',
        name: 'ownerType',
        validation: [Validation.required],
      },
    ],
    options: [
      {
        label: translateTo(lang, 'I would like to sell my property'),
        value: 'seller',
      },
      {
        label: translateTo(lang, 'Because of an inheritance or transfer within the family'),
        value: 'inheritance',
      },
      {
        label: translateTo(lang, "I just want to know the price development of my property. I don't want to sell"),
        value: 'price-development',
      },
      {
        label: translateTo(lang, 'I would like to conclude or renew my mortgage'),
        value: 'mortgage',
      },
      {
        label: translateTo(lang, 'I would like to buy a property'),
        value: 'buyer',
      },
      {
        label: translateTo(lang, 'Just out of curiosity'),
        value: 'curiosity',
      },
      {
        label: translateTo(lang, 'Other reason'),
        value: 'other',
      },
    ],
    icons: true,
  },
  {
    title: translateTo(lang, 'When do you want to sell?'),
    component: BrixelRadioButton,
    conditions: [{
      name: 'ownerType',
      value: 'seller',
    }],
    history: 'apartmentSellTiming',
    inputs: [
      {
        label: '',
        name: 'apartmentSellTiming',
        validation: [Validation.required],
      },
    ],
    options: [
      {
        label: translateTo(lang, 'As soon as possible'),
        value: 'asap',
      },
      {
        label: translateTo(lang, 'In a few months'),
        value: 'few-months',
      },
      {
        label: translateTo(lang, "I don't want to sell now"),
        value: 'no-sell',
      },
    ],
    icons: true,
  },
  {
    title: translateTo(lang, 'When do you want to sell?'),
    component: BrixelRadioButton,
    conditions: [{
      name: 'ownerType',
      value: 'buyer',
    }],
    history: 'typeOfBuyer',
    inputs: [
      {
        label: '',
        name: 'typeOfBuyer',
        validation: [Validation.required],
      },
    ],
    options: [
      {
        label: translateTo(lang, 'I am a first time buyer'),
        value: 'first-time-buyer',
      },
      {
        label: translateTo(lang, 'I already own a property'),
        value: 'owned-property',
      },
    ],
    icons: true,
  },
];
