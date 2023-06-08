import {PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FinancingType {
  activeSingleProperty: PropertyType,
  lang: string,
  handleSetModal: (data: object) => void;
}
