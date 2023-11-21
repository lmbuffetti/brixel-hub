import {PropertyType, LoggedUserType} from '@brixel-io/brixel-components/dist/@types/Model';

export interface FormValueType {
  status: boolean;
  redirectLink: string;
  register: LoggedUserType;
  login: {
    email: string
    password: string
  };
  signupScreen: string;
}

export interface VisitFeedbackType {
  activeSingleCompany: CompanyType;
  activeSingleProperty: PropertyType;
  changeFieldValue: (field: string, val: string | boolean) => void;
  destroyForm: () => void;
  formValue: FormValueType;
  handleCreateUser: (data: object) => void;
  handleDoLogin: (data: object) => void;
  handleGetActiveSingleProperty: (data: object) => void;
  handleSendVisitFeedback: (data: object) => void;
  handleSetIsSmallLoading: (data: object) => void;
  lang: string;
  loggedInUser: LoggedUserType;
  translations: object;
}
