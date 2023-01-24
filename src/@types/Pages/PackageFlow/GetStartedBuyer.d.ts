import {CompanyType, LoginType, RegistrationType, SearchProfileType} from '@brixel/brixel-components/dist/@types/Model';

export interface FormValueType extends SearchProfileType {
  channel: string;
  changeCountry: string;
  company: string;
  owner: string | null;
  login: LoginType;
  register: RegistrationType;
}

export interface GetStartedType {
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, val: string | null) => void;
  company: CompanyType;
  destroyForm: () => void;
  errorValue: object;
  formValue: FormValueType;
  handleCreateSearchProfile: (data: object) => void;
  handleDoLogin: (data: object) => void;
  handleGetActiveSingleCompany: (data: object) => void;
  handleSpinnerOff: () => void;
  handleSpinnerOn: () => void;
  handleValidateUser: (data: object) => void;
  initForm: (data: object) => void;
  initialValues: object;
  isLoading: boolean;
  lang?: string;
  loggedInUser: object;
  translations: object;
  handleReset: (data: object) => void;
}
