import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface MarketCardEstimationType {
  activeSingleProperty: PropertyType;
  handleDeleteEstimation: (data: object) => void;
  handleSetModal: (data: object) => void;
  lang: string;
}

export interface ActionDetailType {
  id: null | string;
  active: boolean;
}
