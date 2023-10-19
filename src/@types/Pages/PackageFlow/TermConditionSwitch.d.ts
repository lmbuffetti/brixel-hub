import {CompanyType, PropertyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface TermsConditionSwitchType {
  activeSinglePropertyHistory: {
    total: number;
    data: object[];
  };
  activeSingleCompany: CompanyType,
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, value: string | boolean) => void;
  formValue: object,
  handleSetModal: (data: object) => void;
  lang: string;
  onSaveData: (data?: string) => void;
  syncErrors: object,
  windowDimensions: object,
}
