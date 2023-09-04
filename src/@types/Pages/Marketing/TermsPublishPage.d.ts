import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType {
  channel: string;
  changeCountry: string;
  company: string;
  owner: string | null;
}

export interface TermsPublishPageType {
  activeSingleCompany: CompanyType
  changeFieldValue: (field: string, value: string | null) => void;
  destroyForm: () => void;
  formValue: FormValueType;
  handleGetActiveSingleCompany: (data: object) => void;
  handleSpinnerOff: () => void;
  lang?: string;
  loggedInUser: object;
  translations: object;
}
