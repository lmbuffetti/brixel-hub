import {CompanyType, LoggedUserType, PropertyType} from '@brixel/brixel-components/dist/@types/Model';

export interface TermsConditionType {
  activeSingleCompany: CompanyType;
  changeFieldValue: (field: string, val: string | null | boolean | string[] | object | number) => void;
  company: CompanyType;
  destroyForm: () => void;
  errorValue: object;
  formValue: PropertyType;
  handleGetActiveSingleCompany: (data: object) => void;
  handleReset: (data: object) => void;
  handleSaveActiveSingleUser: (data: object) => void;
  handleSpinnerOff: () => void;
  initForm: (data: object) => void;
  initialValues: object;
  isSmallLoading: {
    sendData: boolean;
  };
  lang?: string;
  loggedInUser: LoggedUserType;
  translations: object;
}
