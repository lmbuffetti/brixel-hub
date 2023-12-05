import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FinancingType {
  activeSingleCompany: CompanyType,
  activeSingleProperty: PropertyType,
  lang: string,
  handleSetModal: (data: object) => void;
}
