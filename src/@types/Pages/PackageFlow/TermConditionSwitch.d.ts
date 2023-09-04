import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface TermsContidionSwitchType {
  activeSingleCompany: CompanyType,
  formValue: object,
  syncErrors: object,
  lang: string;
  onSaveData: (data?: string) => void;
  windowDimensions: object,
}
