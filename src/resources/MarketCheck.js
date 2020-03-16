/* eslint-disable max-len */
import {
  BrixelRadioButton,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeMarketCheck from '../Pages/MarketChecker/ResumeMarketCheck';
import { translateTo } from '../utils/translation';

const { factsOptions } = FactsOptions;

export const MarketCheckQuestions = (lang) => [
  {
    title: translateTo(lang,"What do you need the market check for?"),
    history: "ownerType",
    vCentered: true,
    toSave: true,
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-md-3 px-1',
        label: '',
        name: "ownerType",
        validation: [Validation.required],
        options: factsOptions.userType,
        icons: true,
      },
    ],
  },
  {
    title: translateTo(lang,"When do you want to sell?"),
    vCentered: true,
    conditions: [{
      name: 'ownerType',
      value: 'seller',
    }],
    history: "apartmentSellTiming",
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-md-3 px-1',
        label: '',
        name: 'whenToSell',
        validation: [Validation.required],
        icons: true,
        options: factsOptions.userSeller,
      },
    ],
  },
  {
    title: translateTo(lang, "When do you want to sell?"),
    conditions: [{
      name: 'ownerType',
      value: 'buyer',
    }],
    history: "typeOfBuyer",
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-2 py-md-3 px-1',
        icons: true,
        label: '',
        name: 'typeOfBuyer',
        validation: [Validation.required],
        options: factsOptions.userBuyer,
      },
    ],
  },
  {
    title: "Market Check",
    vCentered: true,
    subtitle: "Sales strategy & price",
    history: "localMarketCheck",
    cardType: "loadComponent",
    component: ResumeMarketCheck,
  },
];
