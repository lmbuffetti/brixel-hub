import {CompanyType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType {
  channel: string;
  changeCountry: string;
  company: string;
  owner: string | null;
}

export interface TermsPublishPageType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  destroyForm: () => void;
  formValue: FormValueType;
  handleGetActiveSingleCompany: (data: object) => void;
  handleGetActiveSingleProperty: (data: object) => void;
  handleSetSmallLoading: (data: object) => void;
  handleAcceptPageTerms: (data: object) => void;
  handleSpinnerOff: () => void;
  initForm: (data: object) => void;
  initialValues: object;
  lang: string;
  translations: object;
}
