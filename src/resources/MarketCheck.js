/* eslint-disable max-len */
import {
  BrixelInputScale,
  FactsOptions,
  Validation,
} from '@brixel/brixel-components';
import LocalMarketCheck from '../Pages/MarketChecker/LocalMarketCheck';
import SuccessMarketCheck from '../Pages/MarketChecker/SuccessMarketCheck';

const { factsOptions } = FactsOptions;

export const MarketCheckQuestions = (lang) => [
  // SECTION: PROPERTY TYPE
  {
    title: "Sales strategy & price",
    subtitle: "Sales strategy & price",
    history: "salesStrategyPrice",
    cardType: "salesStrategyPrice",
    inputs: [
      {
        component: BrixelInputScale,
        className: '',
        label: 'In which condition is the property?',
        name: 'properties.building.conditionCode',
        options: factsOptions.quality,
        validation: [Validation.markRequired]
      },
    ]
  },
  {
    title: "Market Check",
    subtitle: "Sales strategy & price",
    history: "localMarketCheck",
    cardType: "localMarketCheck",
    component: LocalMarketCheck,
  },
  {
    title: "Thank you Market Check",
    subtitle: "Sales strategy & price",
    history: "successLocalMarketCheck",
    cardType: "successLocalMarketCheck",
    component: SuccessMarketCheck,
  }
];
