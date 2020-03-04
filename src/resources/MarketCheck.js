/* eslint-disable max-len */
import {
  BrixelInputScale,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import ResumeMarketCheck from '../Pages/MarketChecker/ResumeMarketCheck';
import SuccessMarketCheck from '../Pages/MarketChecker/SuccessMarketCheck';
import startMarketCheck from '../images/MarketCheck/startMarketCheck.svg';

const { factsOptions } = FactsOptions;

export const MarketCheckQuestions = (lang) => [
  // SECTION: PROPERTY TYPE
  {
    toSave: true,
    background: 'bgGreen100',
    vCentered: true,
    img: startMarketCheck,
    title: "Check your local market.",
    description: "Stop browsing all the portals. I show you all similar properties on sale. Instantly.",
    history: "introFlow",
    cardType: "text",
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
