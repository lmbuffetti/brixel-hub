import {PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface FinancingType {
  activeSingleProperty: PropertyType,
  lang: string,
  handleSetModal: (data: object) => void;
}
