import { BrixelRadioButton, Validation } from '@brixel/brixel-components/dist/form';
import translateTo from '../../utils/translation';
import brixelComingTown from '../../images/BrxielComingTown/secondAwards.svg';

export const PackageFlow = (lang) => [
  {
    conditions: [{
      name: 'signup',
      value: true,
    }],
    title: translateTo('Welcome to the home of your home.', lang),
    subtitle: translateTo('You earned the <span class=txtGreen400>"Newcomer"</span> Award and +100 Brixels.', lang),
    history: 'rewardsStep',
    cardType: 'RewardsStep',
    background: 'bgBlue100',
    img: brixelComingTown,
  },
  {
    title: translateTo('What do you need the market check for?', lang),
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
        label: translateTo('I would like to sell my property', lang),
        value: 'seller',
      },
      {
        label: translateTo('Because of an inheritance or transfer within the family', lang),
        value: 'inheritance',
      },
      {
        label: translateTo("I just want to know the price development of my property. I don't want to sell", lang),
        value: 'price-development',
      },
      {
        label: translateTo('I would like to conclude or renew my mortgage', lang),
        value: 'mortgage',
      },
      {
        label: translateTo('I would like to buy a property', lang),
        value: 'buyer',
      },
      {
        label: translateTo('Just out of curiosity', lang),
        value: 'curiosity',
      },
      {
        label: translateTo('Other reason', lang),
        value: 'other',
      },
    ],
    icons: true,
  },
  {
    title: translateTo('When do you want to sell?', lang),
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
        label: translateTo('As soon as possible', lang),
        value: 'asap',
      },
      {
        label: translateTo('In a few months', lang),
        value: 'few-months',
      },
      {
        label: translateTo("I don't want to sell now", lang),
        value: 'no-sell',
      },
    ],
    icons: true,
  },
  {
    title: translateTo('When do you want to sell?', lang),
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
        label: translateTo('I am a first time buyer', lang),
        value: 'first-time-buyer',
      },
      {
        label: translateTo('I already own a property', lang),
        value: 'owned-property',
      },
    ],
    icons: true,
  },
];
