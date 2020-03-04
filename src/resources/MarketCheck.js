/* eslint-disable max-len */
import {
  BrixelRadioButton,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeMarketCheck from '../Pages/MarketChecker/ResumeMarketCheck';
import SuccessMarketCheck from '../Pages/MarketChecker/SuccessMarketCheck';
import startMarketCheck from '../images/MarketCheck/startMarketCheck.svg';
import { translateTo } from '../utils/translation';

const { factsOptions } = FactsOptions;

export const MarketCheckQuestions = (lang) => [
  // SECTION: PROPERTY TYPE
  {
    toSave: true,
    background: 'bgGreen100',
    vCentered: true,
    img: startMarketCheck,
    title: "Check your local market",
    description: "Stop browsing all the portals. I show you all similar properties on sale. Instantly.",
    history: "introFlow",
    cardType: "text",
  },
  {
    title: translateTo(lang,"What do you need the market check for?"),
    history: "ownerType",
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-3 px-1',
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
    conditions: [{
      name: 'ownerType',
      value: 'seller',
    }],
    history: "apartmentSellTiming",
    inputs: [
      {
        component: BrixelRadioButton,
        pdClass: 'py-3 px-1',
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
  {
    title: "Thank you Market Check",
    vCentered: true,
    subtitle: "Sales strategy & price",
    history: "successLocalMarketCheck",
    cardType: "loadComponent",
    component: SuccessMarketCheck,
  }
];
